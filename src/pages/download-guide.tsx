import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Stripe from 'stripe';
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

// Configs
const s3Client = new S3Client({
  region: 'ap-southeast-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const bucketName = 'coracle';
const distributionUrl = 'https://d2gs0ocb6y9y9p.cloudfront.net';
const downloadLimit = Number(process.env.OFFLINE_GUIDE_DOWNLOAD_LIMIT || 20);
const expiresMs = 15 * 60 * 1000; // 15 minutes

const isPdf = (name: string) => name.toLowerCase().endsWith('.pdf');

const sortFiles = (a: DownloadLink, b: DownloadLink) => {
  const isPdfA = a.name.toLowerCase().endsWith('.pdf');
  const isPdfB = b.name.toLowerCase().endsWith('.pdf');

  if (isPdf(a.name) && !isPdf(b.name)) return -1;
  if (!isPdf(a.name) && isPdf(b.name)) return 1;

  return a.name.localeCompare(b.name);
};

type DownloadLink = {
  name: string;
  url: string;
};

type Props = {
  downloadLinks?: DownloadLink[];
  error?: string;
};

export default function DownloadGuide(props: Props) {
  if (props.error) {
    return (
      <div className="page-wrap text-center pt-48">
        {props.error} Please contact admin@vietnamcoracle.com for assistance.
      </div>
    );
  }
  return (
    <div className="page-wrap flex justify-center items-center pt-48 pb-12">
      <div className="max-w-screen-sm w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Download Files</h2>
        <ul className="space-y-2">
          {props.downloadLinks.sort(sortFiles).map(link => (
            <li key={link.name}>
              <a href={link.url} download={link.name} className="btn w-full">
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
}: GetServerSidePropsContext) => {
  const sessionId = query['checkout_session_id'] as string;

  if (!sessionId) {
    return {
      props: {
        error: 'Session ID is required.',
      },
    };
  }

  const stripe = new Stripe(
    sessionId.startsWith('cs_test')
      ? process.env.STRIPE_SECRET_KEY_TEST
      : process.env.STRIPE_SECRET_KEY,
  );

  // Retrieve the session from Stripe
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['payment_link'],
  });

  // Extract the Payment Link ID from the Checkout Session
  const paymentLink = session.payment_link as Stripe.PaymentLink;
  const s3Prefix = paymentLink.metadata.s3_prefix;

  const listCommand = new ListObjectsV2Command({
    Bucket: bucketName,
    Prefix: s3Prefix,
  });

  const listResponse = await s3Client.send(listCommand);

  if (!listResponse.Contents || listResponse.Contents.length === 0) {
    return {
      props: {
        error: `Failed to retrieve guide contents for checkout session ID ${sessionId}.`,
      },
    };
  }

  const fileKeys = listResponse.Contents.map(obj => obj.Key).filter(
    key => key !== s3Prefix + '/',
  );

  fileKeys.push('Offline Maps How-to Guide.pdf');

  // Retrieve the Payment Intent to get the current download count
  const paymentIntentId = session.payment_intent as string;

  // Retrieve the Payment Intent to get the current download count
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  // Increment the download count
  const currentCount = paymentIntent.metadata.download_count || 0;
  const newCount = Number(currentCount) + 1;

  // Update the Payment Intent with the new download count
  await stripe.paymentIntents.update(paymentIntentId, {
    metadata: { download_count: newCount.toString() },
  });

  if (newCount > downloadLimit) {
    return {
      props: {
        error: `Download link expired for checkout session ID ${sessionId}.`,
      },
    };
  }

  // Generate a signed URLs
  const downloadLinks: DownloadLink[] = [];

  for (const fileKey of fileKeys) {
    const signedUrl = await getSignedUrl({
      url: `${distributionUrl}/${fileKey.trim()}`,
      keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
      privateKey: process.env.CLOUDFRONT_PRIVATE_KEY.replace(/\\n/g, '\n'),
      dateLessThan: new Date(Date.now() + expiresMs).toISOString(),
    });

    downloadLinks.push({
      name: fileKey.replace(`${s3Prefix}/`, '').trim(),
      url: signedUrl,
    });
  }

  return {
    props: {
      downloadLinks,
    },
  };
};
