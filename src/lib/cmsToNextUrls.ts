export default function cmsToNextUrls(body: string): string {
  return body.replace(
    /cms\.vietnamcoracle\.com(?!\/wp-content)/g,
    'vietnamcoracle.com',
  );
}
