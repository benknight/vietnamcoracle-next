import { groupBy } from 'lodash';
import { SearchParams } from 'next/dist/server/request/search-params';
import { Fragment } from 'react';
import Stripe from 'stripe';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import DownloadGuideError from './components/DownloadGuideError';
import DownloadGuideSelection from './components/DownloadGuideSelection';

interface File {
  name: string;
  key: string;
}

interface Props {
  searchParams: Promise<SearchParams>;
}

export default async function DownloadGuide({ searchParams }: Props) {
  const { checkout_session_id, guides_choice } = await searchParams;

  let sessionId: string;

  if (!checkout_session_id) {
    return <DownloadGuideError message="Checkout session ID is required." />;
  } else if (Array.isArray(checkout_session_id)) {
    sessionId = checkout_session_id[0];
  } else {
    sessionId = checkout_session_id;
  }

  const isTest = sessionId.startsWith('cs_test');

  const apiKey = isTest
    ? process.env.STRIPE_SECRET_KEY_TEST
    : process.env.STRIPE_SECRET_KEY;

  if (!apiKey) {
    throw new Error('Stripe secret key is not set.');
  }

  const stripe = new Stripe(apiKey);

  let session: Stripe.Checkout.Session;

  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_link', 'payment_intent'],
    });
  } catch (error) {
    return {
      props: {
        error: `Failed to retrieve checkout session ${sessionId}.`,
      },
    };
  }

  let resolvedS3Prefix: string;

  const paymentLink = session.payment_link as Stripe.PaymentLink;
  const paymentIntent = session.payment_intent as Stripe.PaymentIntent;
  const isPackage = 'guides_package_count' in paymentLink.metadata;

  if (isPackage) {
    if ('s3_prefix' in paymentIntent.metadata) {
      resolvedS3Prefix = paymentIntent.metadata.s3_prefix;
    } else {
      const maxSelection = Number(paymentLink.metadata.guides_package_count);
      const paymentLinks = await stripe.paymentLinks.list({
        expand: ['data.line_items'],
        limit: 100,
      });

      const guideOptions = paymentLinks.data
        .filter(
          link =>
            's3_prefix' in link.metadata &&
            link.metadata.s3_prefix.split(',').length === 1,
        )
        .map(link => [
          link.metadata.s3_prefix,
          link.line_items?.data[0].description || '',
        ]);

      if (typeof guides_choice !== 'string') {
        throw new Error('Unexpected guides choice format.');
      }

      if (!guides_choice) {
        return (
          <DownloadGuideSelection
            options={guideOptions}
            maxSelection={maxSelection}
          />
        );
      }

      const guidesChoice = guides_choice.split(',') ?? [];
      const guideChoiceCount = guidesChoice.length;

      if (maxSelection !== guideChoiceCount) {
        return (
          <DownloadGuideError
            message={`Invalid number of guides selected for checkout session ${sessionId}.`}
          />
        );
      }

      if (
        !guidesChoice.every(choice =>
          guideOptions.some(([key]) => key === choice),
        )
      ) {
        return (
          <DownloadGuideError
            message={`Invalid guide selection for checkout session ${sessionId}.`}
          />
        );
      }

      await stripe.paymentIntents.update(paymentIntent.id, {
        metadata: { s3_prefix: guidesChoice.join(',') },
      });

      resolvedS3Prefix = guidesChoice.join(',');
    }
  } else {
    resolvedS3Prefix = paymentLink.metadata.s3_prefix;
  }

  if (!resolvedS3Prefix) {
    return (
      <DownloadGuideError
        message={`Failed to resolve guide contents for ${sessionId}.`}
      />
    );
  }

  const s3Prefixes = resolvedS3Prefix.split(',');
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!accessKeyId || !secretAccessKey) {
    throw new Error('AWS credentials are not set.');
  }

  const s3Client = new S3Client({
    region: 'ap-southeast-1',
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  const files: File[] = [];

  for (const prefix of s3Prefixes) {
    const listCommand = new ListObjectsV2Command({
      Bucket: 'coracle',
      Prefix: prefix,
    });

    const listResponse = await s3Client.send(listCommand);

    if (!listResponse.Contents || listResponse.Contents.length === 0) {
      return (
        <DownloadGuideError
          message={`Failed to retrieve guide contents for checkout session ID ${sessionId}.`}
        />
      );
    }

    files.push(
      ...listResponse.Contents.map(obj => obj.Key)
        .filter(key => key && key !== prefix + '/')
        .map((key: string) => ({
          name: key.replace(`${prefix}/`, '').trim(),
          key,
        })),
    );
  }

  files.push({
    name: 'Offline Maps How-to Guide.pdf',
    key: 'Offline Maps How-to Guide.pdf',
  });

  const groups = groupBy(files, file => file.key.split('/')[0]);

  return (
    <div className="page-wrap flex justify-center items-center py-24">
      <div className="max-w-screen-sm w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Your Downloads</h2>
        <p className="text-center">
          Note: You can always get back to this page by clicking the link in the
          email you received.
        </p>
        {Object.keys(groups).map(prefix => {
          const sortedFiles = groups[prefix].sort(sortFiles);
          return (
            <Fragment key={prefix}>
              <h3 className="text-lg mt-8 mb-4 font-medium text-center">
                {groups[prefix].sort(sortFiles)[0].name.replace('.pdf', '')}
              </h3>
              <ul className="space-y-2 border border-opacity-10 p-2 rounded-xl">
                {sortedFiles.map(file => {
                  const urlParams = new URLSearchParams({
                    file_key: file.key,
                    is_test: isTest ? '1' : '0',
                    pi: paymentIntent.id,
                  });
                  return (
                    <li key={file.name}>
                      <a
                        className="btn w-full"
                        href={`/api/download-link?${urlParams.toString()}`}
                        target="_blank"
                        rel="noopener noreferrer">
                        {file.name}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

function isPdf(name: string) {
  return name.toLowerCase().endsWith('.pdf');
}

function sortFiles(a: File, b: File) {
  const aPrefix = a.key.split('/')[0];
  const bPrefix = b.key.split('/')[0];

  if (aPrefix === bPrefix) {
    if (isPdf(a.name) && !isPdf(b.name)) return -1;
    if (!isPdf(a.name) && isPdf(b.name)) return 1;
    return a.name.localeCompare(b.name);
  }

  return aPrefix.localeCompare(bPrefix);
}
