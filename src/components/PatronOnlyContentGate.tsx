import { useRouter } from 'next/router';
import { oauthRedirect } from '../config/patreon';

export default function PatreonLoginButton() {
  const router = useRouter();
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.PATREON_OAUTH_CLIENT_ID,
    redirect_uri: oauthRedirect,
    scope: 'identity',
    state: router.asPath,
  });
  return (
    <div className="page-wrap page-wrap--center text-center font-display">
      <h1 className="text-2xl mb-4">
        This content is only available to Patrons of Vietnam Coracle
      </h1>
      <a
        className="btn"
        href={`https://www.patreon.com/oauth2/authorize?${params.toString()}`}>
        Click here to login with Patreon
      </a>
    </div>
  );
}
