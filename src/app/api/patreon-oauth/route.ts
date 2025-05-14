import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { oauthRedirect } from '../../../config/patreon';

const cookieKey = 'patreon_token';

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const signout = searchParams.get('signout');
  const state = searchParams.get('state');

  let redirectTo = searchParams.get('redirect');

  if (signout) {
    cookieStore.delete(cookieKey);
  } else if (code) {
    const response = await fetch('https://www.patreon.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.NEXT_PUBLIC_PATREON_OAUTH_CLIENT_ID || '',
        client_secret: process.env.PATREON_OAUTH_CLIENT_SECRET || '',
        code: String(code),
        redirect_uri: oauthRedirect,
      }).toString(),
    });

    const result = await response.json();

    if (result.access_token) {
      cookieStore.set({
        name: cookieKey,
        value: result.access_token,
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV !== 'development',
      });
    }

    redirectTo = String(state);
  }

  redirect(redirectTo || '/');
}
