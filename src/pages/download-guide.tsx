import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Stripe from 'stripe';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

const isPdf = (name: string) => name.toLowerCase().endsWith('.pdf');

const sortFiles = (a: File, b: File) => {
  if (isPdf(a.name) && !isPdf(b.name)) return -1;
  if (!isPdf(a.name) && isPdf(b.name)) return 1;
  return a.name.localeCompare(b.name);
};

type File = {
  name: string;
  key: string;
};

type Props = {
  files?: File[];
  isTest?: boolean;
  error?: string;
  paymentIntentId?: string;
};

export default function DownloadGuide(props: Props) {
  const onClick = async (fileKey: string) => {
    const response = await fetch('/api/download-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file_key: fileKey,
        is_test: props.isTest,
        pi: props.paymentIntentId,
      }),
    });

    const text = await response.text();

    if (response.status !== 200) {
      alert(`${text}. Please contact admin@vietnamcoracle.com for assistance.`);
      return;
    }

    window.open(text, '_blank');
  };

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
          {props.files.sort(sortFiles).map(file => (
            <li key={file.name}>
              <button
                type="button"
                onClick={() => onClick(file.key)}
                className="btn w-full">
                {file.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context: GetServerSidePropsContext,
) => {
  const { query } = context;
  const sessionId = query['checkout_session_id'] as string;
  const isTest = sessionId.startsWith('cs_test');

  if (!sessionId) {
    return {
      props: {
        error: 'Session ID is required.',
      },
    };
  }

  const stripe = new Stripe(
    isTest ? process.env.STRIPE_SECRET_KEY_TEST : process.env.STRIPE_SECRET_KEY,
  );

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['payment_link'],
  });

  const paymentLink = session.payment_link as Stripe.PaymentLink;
  const paymentIntentId = session.payment_intent as string;
  const s3Prefix = paymentLink.metadata.s3_prefix;

  const s3Client = new S3Client({
    region: 'ap-southeast-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const listCommand = new ListObjectsV2Command({
    Bucket: 'coracle',
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

  return {
    props: {
      files: fileKeys.map(key => ({
        name: key.replace(`${s3Prefix}/`, '').trim(),
        key,
      })),
      isTest,
      paymentIntentId,
    },
  };
};
