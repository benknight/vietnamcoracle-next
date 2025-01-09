import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { oauthRedirect } from '../config/patreon';

type Props = {
  patron?: {
    email?: string;
    name: string;
  };
  patreonLevel?: number;
};

export default function PatronOnlyContentGate({ patron, patreonLevel }: Props) {
  const router = useRouter();

  const oauthParams = useMemo(
    () =>
      new URLSearchParams({
        response_type: 'code',
        client_id: process.env.NEXT_PUBLIC_PATREON_OAUTH_CLIENT_ID,
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
      <h1 className="text-xl sm:text-2xl mb-6">
        {patron && patreonLevel ? (
          `This content requires a minimum Patreon contribution level of $${patreonLevel}.`
        ) : (
          <>
            This content is for Patreon members only. If you are already a
            Patron of Vietnam Coracle, please log in with the button below, or{' '}
            <a
              className="link"
              href="https://www.patreon.com/vietnamcoracle/membership"
              target="_blank">
              click here to sign up
            </a>
            .
          </>
        )}
      </h1>

      {patron ? (
        <>
          Logged in as {patron.email || patron.name}.{' '}
          <a
            className="link"
            href="https://www.patreon.com/vietnamcoracle/membership"
            target="_blank">
            Manage your membership
          </a>{' '}
          or{' '}
          <a
            className="link"
            href={`/api/patreon-oauth/?${signOutParams.toString()}`}>
            click here to sign out
          </a>
          .
        </>
      ) : (
        <div className="block max-w-sm mx-auto">
          <a
            className="btn btn-patreon flex h-12"
            href={`https://www.patreon.com/oauth2/authorize?${oauthParams.toString()}`}>
            <img
              alt=""
              className="w-4 h-4 mr-2"
              src="/Digital-Patreon-Logo_FieryCoral.png"
            />
            Login with Patreon
          </a>
        </div>
      )}
    </div>
  );
}
