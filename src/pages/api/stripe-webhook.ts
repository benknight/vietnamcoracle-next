import AWS from 'aws-sdk';
import { NextApiRequest, NextApiResponse } from 'next';
import getRawBody from 'raw-body';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      await getRawBody(req),
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET,
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

      if (!paymentLink.metadata.s3_file_key) {
        console.log('No file key found in Payment Link metadata');
        break;
      }

      const { description } = paymentLink.line_items.data[0];

      const params: AWS.SES.SendEmailRequest = {
        Source: '"Vietnam Coracle" <admin@vietnamcoracle.com>', // sender email
        Destination: {
          ToAddresses: [customerEmail], // recipient email
        },
        Message: {
          Body: {
            Text: {
              Data: `Here’s your download link for ${description}:\n\nhttps://www.vietnamcoracle.com/api/download-guide/?checkout_session_id=${session.id}`,
            },
          },
          Subject: {
            Data: `Download link for ${description}`,
          },
        },
      };

      const ses = new AWS.SES();

      ses.sendEmail(params, (error, data) => {
        if (error) {
          console.error('Error sending email', error);
        } else {
          console.log('Email sent', data.MessageId);
        }
      });

      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.send(null);
}
