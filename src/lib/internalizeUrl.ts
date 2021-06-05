export default function internalizeUrl(url: string): string {
  return url
    .replace(/https:\/\/vietnamcoracle\.com\//, '')
    .replace(/https:\/\/www\.vietnamcoracle\.com\//, '');
}
