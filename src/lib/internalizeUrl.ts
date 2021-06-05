import URL from 'url-parse';

export const internalHostnames = [
  'www.vietnamcoracle.com',
  'vietnamcoracle.com',
];

export default function internalizeUrl(url: string): string {
  const { hostname, pathname } = new URL(url);
  if (internalHostnames.includes(hostname)) {
    return pathname;
  }
  return url;
}
