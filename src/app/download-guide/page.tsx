import { groupBy } from 'lodash';
import Stripe from 'stripe';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import DownloadGuideError from './components/DownloadGuideError';
import DownloadGuideSelection from './components/DownloadGuideSelection';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

interface File {
  name: string;
  key: string;
}

interface Props {
  searchParams: Promise<{
    checkout_session_id?: string;
    guides_choice?: string;
  }>;
}

interface DownloadGuideTreeViewProps {
  groups: { [key: string]: File[] };
  isTest: boolean;
  paymentIntentId: string;
}

function DownloadGuideTreeView({
  groups,
  isTest,
  paymentIntentId,
}: DownloadGuideTreeViewProps) {
  return (
    <SimpleTreeView
      className="bg-black/5 dark:bg-white/5 rounded py-2"
      aria-label="file system navigator">
      {Object.keys(groups).map(prefix => {
        const sortedFiles = groups[prefix].sort(sortFiles);
        const guideName =
          prefix === 'Offline Maps How-to Guide.pdf'
            ? 'Offline Maps How-to Guide'
            : sortedFiles[0].name.replace('.pdf', '');

        const pdfFiles = sortedFiles.filter(file => isPdf(file.name));
        const mapFiles = sortedFiles.filter(
          file => isKmz(file.name) || isGpx(file.name),
        );
        const gpxFiles = mapFiles.filter(file => isGpx(file.name));
        const kmzFiles = mapFiles.filter(file => isKmz(file.name));

        return (
          <TreeItem
            key={prefix}
            itemId={prefix}
            label={guideName}
            className="text-lg mt-4 mb-2 font-medium !font-sans">
            {pdfFiles.map(file => {
              const urlParams = new URLSearchParams({
                file_key: file.key,
                is_test: isTest ? '1' : '0',
                pi: paymentIntentId,
              });
              return (
                <TreeItem
                  key={file.name}
                  itemId={`${file.key}-item`} // Unique itemId
                  label={
                    <a
                      className="hover:underline"
                      href={`/api/download-link?${urlParams.toString()}`}
                      target="_blank"
                      rel="noopener noreferrer">
                      {file.name}
                    </a>
                  }
                />
              );
            })}
            {mapFiles.length > 0 && (
              <TreeItem
                key={`${prefix}-map-files`}
                itemId={`${prefix}-map-files`}
                label="Map Files"
                className="!font-sans">
                {gpxFiles.length > 0 && (
                  <TreeItem
                    key={`${prefix}-map-files-gpx`}
                    itemId={`${prefix}-map-files-gpx`}
                    label="GPX">
                    {gpxFiles.map(file => {
                      const urlParams = new URLSearchParams({
                        file_key: file.key,
                        is_test: isTest ? '1' : '0',
                        pi: paymentIntentId,
                      });
                      return (
                        <TreeItem
                          key={file.name}
                          itemId={`${file.key}-item`} // Unique itemId
                          label={
                            <a
                              className="hover:underline"
                              href={`/api/download-link?${urlParams.toString()}`}
                              target="_blank"
                              rel="noopener noreferrer">
                              {file.name}
                            </a>
                          }
                        />
                      );
                    })}
                  </TreeItem>
                )}
                {kmzFiles.length > 0 && (
                  <TreeItem
                    key={`${prefix}-map-files-kmz`}
                    itemId={`${prefix}-map-files-kmz`}
                    label="KMZ">
                    {kmzFiles.map(file => {
                      const urlParams = new URLSearchParams({
                        file_key: file.key,
                        is_test: isTest ? '1' : '0',
                        pi: paymentIntentId,
                      });
                      return (
                        <TreeItem
                          className="even:bg-black/5 even:dark:bg-white/5"
                          key={file.name}
                          itemId={`${file.key}-item`} // Unique itemId
                          label={
                            <a
                              className="hover:underline"
                              href={`/api/download-link?${urlParams.toString()}`}
                              target="_blank"
                              rel="noopener noreferrer">
                              {file.name}
                            </a>
                          }
                        />
                      );
                    })}
                  </TreeItem>
                )}
              </TreeItem>
            )}
          </TreeItem>
        );
      })}
    </SimpleTreeView>
  );
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

      if (!guides_choice) {
        return (
          <DownloadGuideSelection
            options={guideOptions}
            maxSelection={maxSelection}
          />
        );
      }

      if (typeof guides_choice !== 'string') {
        throw new Error('Unexpected guides choice format.');
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

  // Always include the offline maps guide at the beginning
  files.push({
    name: 'Offline Maps How-to Guide.pdf',
    key: 'Offline Maps How-to Guide.pdf',
  });

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

  const groups = groupBy(files, file => file.key.split('/')[0]);

  return (
    <div className="page-wrap flex justify-center items-center py-24">
      <div className="max-w-screen-sm w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Your Downloads</h2>
        <p className="text-center text-sm mb-8">
          Thank you for your support! You can always get back to this page by
          clicking the link in the email you received after making your
          purchase. — Tom
        </p>
        <DownloadGuideTreeView
          groups={groups}
          isTest={isTest}
          paymentIntentId={paymentIntent.id}
        />
      </div>
    </div>
  );
}

function isPdf(name: string) {
  return name.toLowerCase().endsWith('.pdf');
}

function isKmz(name: string) {
  return name.toLowerCase().endsWith('.kmz');
}

function isGpx(name: string) {
  return name.toLowerCase().endsWith('.gpx');
}

function sortFiles(a: File, b: File) {
  const aPrefix = a.key.split('/')[0];
  const bPrefix = b.key.split('/')[0];

  if (aPrefix !== bPrefix) {
    return aPrefix.localeCompare(bPrefix);
  }

  // Assign a priority to each file type: PDF (0), KMZ (1), GPX (2), others (3)
  const getPriority = (name: string) =>
    isPdf(name) ? 0 : isKmz(name) ? 1 : isGpx(name) ? 2 : 3;

  const priorityDiff = getPriority(a.name) - getPriority(b.name);

  if (priorityDiff !== 0) return priorityDiff;

  return a.name.localeCompare(b.name);
}
