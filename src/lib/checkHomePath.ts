export default function checkHomePath(path: string): boolean {
  return [
    '/',
    '/browse',
    '/browse/',
    '/browse/features-guides',
    '/browse/features-guides/',
  ].includes(path);
}
