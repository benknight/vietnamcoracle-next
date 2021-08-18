import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import nodeCookie from 'node-cookie';
import { oauthRedirect } from '../../config/patreon';

export default async function patreonOauth(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { code, state } = req.query;

  let redirect = String(req.query.redirect || '/');

  if (code) {
    const result = await axios({
      data: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.PATREON_OAUTH_CLIENT_ID,
        client_secret: process.env.PATREON_OAUTH_CLIENT_SECRET,
        code: String(code),
        redirect_uri: oauthRedirect,
      }).toString(),
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      url: 'https://www.patreon.com/api/oauth2/token',
    });
    if (result.data.access_token) {
      nodeCookie.create(res, 'patreon_token', result.data.access_token, {
        httpOnly: true,
        path: '/',
        sameSite: 'Lax',
        secure: process.env.NODE_ENV !== 'development',
      });
    } else {
      // TODO: Handle failure
      // console.log(result, JSON.stringify(result, null, 2));
    }
    redirect = String(state);
  }

  res.writeHead(307, { Location: redirect });
  res.end();
}
