import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import nodeCookie from 'node-cookie';
import { oauthRedirect } from '../../config/patreon';

const cookieKey = 'patreon_token';

export default async function patreonOauth(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { code, signout, state } = req.query;

  const cookieOpts = {
    httpOnly: true,
    path: '/',
    sameSite: 'Lax',
    secure: process.env.NODE_ENV !== 'development',
  };

  let redirect = String(req.query.redirect || '/');

  if (signout) {
    console.log('signout', signout);
    nodeCookie.clear(res, cookieKey, cookieOpts);
  } else if (code) {
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
      console.log('nodeCookie.create');
      nodeCookie.create(res, cookieKey, result.data.access_token, cookieOpts);
    } else {
      // TODO: Handle failure
      // console.log(result, JSON.stringify(result, null, 2));
    }
    redirect = String(state);
  }

  res.writeHead(307, { Location: redirect });
  res.end();
}
