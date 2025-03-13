import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Stripe from 'stripe';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { Fragment, useState } from 'react';
import { groupBy } from 'lodash';

const isPdf = (name: string) => name.toLowerCase().endsWith('.pdf');

const sortFiles = (a: File, b: File) => {
  const aPrefix = a.key.split('/')[0];
  const bPrefix = b.key.split('/')[0];

  if (aPrefix === bPrefix) {
    if (isPdf(a.name) && !isPdf(b.name)) return -1;
    if (!isPdf(a.name) && isPdf(b.name)) return 1;
    return a.name.localeCompare(b.name);
  }

  return aPrefix.localeCompare(bPrefix);
};

type File = {
  name: string;
  key: string;
};

type ErrorProps = {
  error: string;
};

type FileProps = {
  files: File[];
  isTest: boolean;
  paymentIntentId: string;
};

type SelectionProps = {
  maxSelection: number;
  options: string[][];
};

type Props = FileProps | ErrorProps | SelectionProps;

export default function DownloadGuide(props: Props) {
  const [selection, setSelection] = useState<string[]>([]);

  if ('error' in props) {
    return (
      <div className="page-wrap text-center pt-48">
        {props.error} Please contact admin@vietnamcoracle.com for assistance.
      </div>
    );
  }

  if ('options' in props) {
    const toggleOption = option => {
      if (selection.includes(option)) {
        setSelection(selection.filter(i => i !== option));
      } else if (selection.length < props.maxSelection) {
        setSelection([...selection, option]);
      }
    };

    return (
      <div className="page-wrap flex justify-center items-center pt-48 pb-12">
        <div className="max-w-screen-sm w-full">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Select up to {props.maxSelection} guides
          </h2>
          <div className="space-y-2">
            {props.options
              .sort((a, b) => a[1].localeCompare(b[1]))
              .map(([key, name]) => (
                <button
                  key={key}
                  onClick={() => toggleOption(key)}
                  className={`w-full p-2 rounded-md transition-colors ${
                    selection.includes(key)
                      ? 'btn bg-primary-500 hover:bg-primary-500 text-white'
                      : 'btn'
                  } ${
                    selection.length >= props.maxSelection &&
                    !selection.includes(key)
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                  disabled={
                    selection.length >= props.maxSelection &&
                    !selection.includes(key)
                  }>
                  {name}
                </button>
              ))}
          </div>
          {selection.length === props.maxSelection && (
            <button
              className="w-full btn mt-8"
              type="button"
              onClick={() => {
                const currentURL = new URL(window.location.href);
                const searchParams = new URLSearchParams(currentURL.search);
                searchParams.set('guides_choice', selection.join(','));
                currentURL.search = searchParams.toString();
                window.location.href = currentURL.toString();
              }}>
              Submit
            </button>
          )}
        </div>
      </div>
    );
  }

  if ('files' in props) {
    const groups = groupBy(props.files, file => file.key.split('/')[0]);
    return (
      <div className="page-wrap flex justify-center items-center py-24">
        <div className="max-w-screen-sm w-full">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Your Downloads
          </h2>
          <p>
            Note: You can always get back to this page by clicking the link in
            the email you received.
          </p>
          {Object.keys(groups).map(prefix => {
            const sortedFiles = groups[prefix].sort(sortFiles);
            return (
              <Fragment key={prefix}>
                <h3 className="text-lg mt-8 mb-4 font-medium text-center">
                  {groups[prefix].sort(sortFiles)[0].name.replace('.pdf', '')}
                </h3>
                <ul className="space-y-2 border border-opacity-10 p-2 rounded-xl">
                  {sortedFiles.map(file => (
                    <li key={file.name}>
                      <button
                        type="button"
                        onClick={() => {
                          const urlParams = new URLSearchParams({
                            file_key: file.key,
                            is_test: props.isTest ? '1' : '0',
                            pi: props.paymentIntentId,
                          });
                          window.open(
                            `/api/download-link?${urlParams.toString()}`,
                            '_blank',
                          );
                        }}
                        className="btn w-full">
                        {file.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </Fragment>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context: GetServerSidePropsContext,
) => {
  const { query } = context;

  if (!query['checkout_session_id']) {
    return {
      props: {
        error: 'Checkout session ID is required.',
      },
    };
  }

  const sessionId = query['checkout_session_id'] as string;
  const isTest = sessionId.startsWith('cs_test');

  const stripe = new Stripe(
    isTest ? process.env.STRIPE_SECRET_KEY_TEST : process.env.STRIPE_SECRET_KEY,
  );

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
          link.line_items.data[0].description,
        ]);

      if (!query['guides_choice']) {
        return {
          props: {
            options: guideOptions,
            maxSelection,
          },
        };
      }
      const guidesChoice = (query['guides_choice'] as string).split(',');
      const guideChoiceCount = guidesChoice.length;

      if (maxSelection !== guideChoiceCount) {
        return {
          props: {
            error: `Invalid number of guides selected for checkout session ${sessionId}.`,
          },
        };
      }

      if (
        !guidesChoice.every(choice =>
          guideOptions.some(([key]) => key === choice),
        )
      ) {
        return {
          props: {
            error: `Invalid guide selection for checkout session ${sessionId}.`,
          },
        };
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
    return {
      props: {
        error: `Failed to resolve guide contents for ${sessionId}.`,
      },
    };
  }

  const s3Prefixes = resolvedS3Prefix.split(',');

  const s3Client = new S3Client({
    region: 'ap-southeast-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
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
      return {
        props: {
          error: `Failed to retrieve guide contents for checkout session ID ${sessionId}.`,
        },
      };
    }

    files.push(
      ...listResponse.Contents.map(obj => obj.Key)
        .filter(key => key !== prefix + '/')
        .map(key => ({
          name: key.replace(`${prefix}/`, '').trim(),
          key,
        })),
    );
  }

  files.push({
    name: 'Offline Maps How-to Guide.pdf',
    key: 'Offline Maps How-to Guide.pdf',
  });

  return {
    props: {
      files,
      isTest,
      paymentIntentId: paymentIntent.id,
    },
  };
};
