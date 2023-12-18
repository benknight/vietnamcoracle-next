import AWS from 'aws-sdk';
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const distributionUrl = 'https://d2gs0ocb6y9y9p.cloudfront.net';
const downloadLimit = Number(process.env.OFFLINE_GUIDE_DOWNLOAD_LIMIT || 20);

function formatMessageHtml(message: string): string {
  return `<html>
  <head>
    <style>
      body {
        font-family: system-ui, sans-serif;
        margin: 2rem;
      }
    </style>
  </head>
  <body>
    <p>${message}</p>
  </body>
</html>`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Read the Checkout Session ID from the URL query parameter
  const sessionId = req.query['checkout_session_id'] as string;

  if (!sessionId) {
    return res.status(400).send(formatMessageHtml('Session ID is required'));
  }

  const stripe = new Stripe(
    sessionId.startsWith('cs_test')
      ? process.env.STRIPE_SECRET_KEY_TEST
      : process.env.STRIPE_SECRET_KEY,
  );

  try {
    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_link'],
    });

    // Extract the Payment Link ID from the Checkout Session
    const paymentLink = session.payment_link as Stripe.PaymentLink;

    // Extract the S3 file key from the Payment Link's metadata
    const fileKey = paymentLink.metadata.s3_file_key;

    if (!fileKey) {
      return res
        .status(404)
        .send(formatMessageHtml('File key not found in Payment Link metadata'));
    }

    // Create a CloudFront Signer
    const signer = new AWS.CloudFront.Signer(
      process.env.CLOUDFRONT_KEY_PAIR_ID,
      process.env.CLOUDFRONT_PRIVATE_KEY.replace(/\\n/g, '\n'),
    );

    // Set options for the signed URL
    const expiresMs = 15 * 60 * 1000;
    const options = {
      url: `${distributionUrl}/${fileKey}`,
      expires: Math.floor((Date.now() + expiresMs) / 1000),
    };

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
      res
        .status(400)
        .send(
          formatMessageHtml(
            `Download limit exceeded. Please contact admin@vietnamcoracle.com to request a new download link and include your order number: ${paymentIntentId}`,
          ),
        );
    } else {
      // Generate a signed URL
      signer.getSignedUrl(options, function (err, url) {
        if (err) {
          res
            .status(500)
            .send(formatMessageHtml('Error generating signed URL'));
        } else {
          res.redirect(url);
        }
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(formatMessageHtml('Error processing request'));
  }
}
