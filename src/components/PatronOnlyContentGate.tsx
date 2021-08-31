import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { oauthRedirect } from '../config/patreon';

export default function PatronOnlyContentGate({ isLoggedIn, patreonLevel }) {
  const router = useRouter();

  const oauthParams = useMemo(
    () =>
      new URLSearchParams({
        response_type: 'code',
        client_id: process.env.PATREON_OAUTH_CLIENT_ID,
        redirect_uri: oauthRedirect,
        scope: 'identity',
        state: router.asPath,
      }),
    [router.asPath],
  );

  const signOutParams = useMemo(
    () =>
      new URLSearchParams({
        redirect: router.asPath,
        signout: '1',
      }),
    [router.asPath],
  );

  return (
    <div className="page-wrap page-wrap--center text-center font-display pt-48 pb-12">
      <h1 className="text-xl sm:text-2xl mb-8">
        {isLoggedIn && patreonLevel
          ? `This content requires a minimum Patreon contribution level of $${patreonLevel}`
          : 'Please log in with Patreon to view this content.'}
      </h1>
      <div className="block max-w-sm mx-auto">
        <a
          className="btn btn-full btn-patreon h-12"
          href={
            isLoggedIn
              ? `/api/patreon-oauth?${signOutParams.toString()}`
              : `https://www.patreon.com/oauth2/authorize?${oauthParams.toString()}`
          }>
          <img
            alt=""
            className="w-4 h-4 mr-2"
            src="/Digital-Patreon-Logo_FieryCoral.png"
          />
          {isLoggedIn ? 'Sign out' : 'Login with Patreon'}
        </a>
      </div>
      <p className="my-8 text-sm">
        <Link href="/become-a-patron-of-vietnam-coracle">
          <a className="link">Learn More</a>
        </Link>
      </p>
    </div>
  );
}
