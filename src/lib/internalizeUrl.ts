export default function internalizeUrl(url: string): string {
  if (url.indexOf('/wp-content') > -1) {
    return url;
  }
  return url
    .replace(/https:\/\/vietnamcoracle\.com/, '')
    .replace(/https:\/\/www\.vietnamcoracle\.com/, '');
}
