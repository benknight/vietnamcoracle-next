import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const distributionUrl = 'https://d2gs0ocb6y9y9p.cloudfront.net';
const downloadLimit = Number(process.env.OFFLINE_GUIDE_DOWNLOAD_LIMIT || 100);
const expiresMs = 60 * 1000; // 1 minutes

const getErrorMessage = (message: string): string => {
  return `${message}. Please contact admin@vietnamcoracle.com for assistance.`;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Read the Checkout Session ID from the URL query parameter
  const paymentIntentId = req.query.pi as string;
  const fileKey = req.query.file_key as string;
  const isTest = req.query.is_test === '1';

  if (!paymentIntentId) {
    return res
      .status(400)
      .send(getErrorMessage('Payment Intent ID is required'));
  }

  const key = isTest
    ? process.env.STRIPE_SECRET_KEY_TEST
    : process.env.STRIPE_SECRET_KEY;

  if (!key) {
    throw new Error('Stripe secret key is not defined');
  }

  const stripe = new Stripe(key);

  try {
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
      res.send(getErrorMessage('Download limit exceeded'));
    } else {
      const url = getSignedUrl({
        url: `${distributionUrl}/${fileKey.trim()}`,
        keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID || '',
        privateKey:
          process.env.CLOUDFRONT_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
        dateLessThan: new Date(Date.now() + expiresMs).toISOString(),
      });
      res.redirect(url);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(getErrorMessage('Unexpected error'));
  }
}
