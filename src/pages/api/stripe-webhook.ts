import AWS from 'aws-sdk';
import { NextApiRequest, NextApiResponse } from 'next';
import getRawBody from 'raw-body';
import Stripe from 'stripe';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-2',
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const isTest = Boolean(req.query['test'] as string);

  let event: Stripe.Event;

  const stripe = new Stripe(
    isTest ? process.env.STRIPE_SECRET_KEY_TEST : process.env.STRIPE_SECRET_KEY,
  );

  try {
    event = stripe.webhooks.constructEvent(
      await getRawBody(req),
      req.headers['stripe-signature'],
      isTest
        ? process.env.STRIPE_WEBHOOK_SECRET_TEST
        : process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.error(error.toString());
    res.status(400).send(`Webhook Error: ${error.message}`);
    return;
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;

      const customerEmail = session.customer_details.email;

      if (!customerEmail) {
        console.log('No customer email found');
        break;
      }

      const paymentLink = await stripe.paymentLinks.retrieve(
        session.payment_link as string,
        { expand: ['line_items'] },
      );

      // Skip any events that don't have the necessary metadata
      const shouldHandleEvent = Object.keys(paymentLink.metadata).some(key =>
        ['s3_prefix', 's3_file_key', 'guides_package_count'].includes(key),
      );

      if (!shouldHandleEvent) {
        console.log(
          'Skipping event because there are no recognize keys in payment link metadata.',
        );
        break;
      }

      const { description } = paymentLink.line_items.data[0];

      const params: AWS.SES.SendEmailRequest = {
        Source: '"Vietnam Coracle" <admin@vietnamcoracle.com>', // sender email
        Destination: {
          ToAddresses: [customerEmail], // recipient email
          BccAddresses: ['vietnamcoracle@gmail.com'],
        },
        Message: {
          Body: {
            Text: {
              Data: `Thank you! Here's your download link for ${description}:\n\nhttps://www.vietnamcoracle.com/download-guide/?checkout_session_id=${session.id}\n\nFor full functionality, open PDF files with Adobe Acrobat Reader or Foxit PDF Reader (free on Android or iOS)\n\nTo open and use KMZ map files please follow the instructions in the Offline Maps How-To Guide PDF.\n\nIf you have any questions or feedback, feel free to reply to this email.\n\nTom`,
            },
          },
          Subject: {
            Data: `Download link for ${description}`,
          },
        },
      };

      const ses = new AWS.SES();

      try {
        const data = await ses.sendEmail(params).promise();
        console.log('Email sent', data.MessageId);
      } catch (error) {
        console.error('Error sending email', error);
      }

      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.send(null);
}
