export default function cmsToNextUrls(body: string): string {
  return body
    .replace(
      /www\.cms\.vietnamcoracle\.com(?!\/wp-content)/g,
      'www.vietnamcoracle.com',
    )
    .replace(
      /cms\.vietnamcoracle\.com(?!\/wp-content)/g,
      'www.vietnamcoracle.com',
    )
    .replace(/\/category\/features-guides\//g, '/browse/');
}
