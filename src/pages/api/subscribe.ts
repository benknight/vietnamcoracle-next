import cors from 'cors';
import type { NextApiRequest, NextApiResponse } from 'next';
// @ts-ignore
import mailchimp from '@mailchimp/mailchimp_marketing';

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
});

// Initializing the cors middleware
const corsMiddleware = cors({
  origin: [
    'http://localhost:3000',
    'https://vietnamcoracle-next.vercel.app',
    'https://vietnamcoracle.com',
    'https://www.vietnamcoracle.com',
  ],
  methods: ['POST'],
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, result => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function preview(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await runMiddleware(req, res, corsMiddleware);

  const { email } = req.body;

  if (!email) {
    return res.status(401).json({
      code: 'ERR_INVALID_REQUEST',
      success: false,
    });
  }

  try {
    await mailchimp.lists.addListMember(process.env.MAILCHIMP_LIST_ID, {
      email_address: email,
      status: 'pending',
    });
    res.status(200).send({ success: true });
  } catch (error) {
    let code = 'ERR_GENERIC';
    if (error.status === 400) {
      code = 'ERR_ALREADY_SUBSCRIBED';
    }
    res.status(error.status || 500).send({
      code,
      success: false,
    });
  }
}
