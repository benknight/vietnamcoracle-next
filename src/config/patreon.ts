export const oauthRedirect = `${
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : `https://www.vietnamcoracle.com`
}/api/patreon-oauth/`;
