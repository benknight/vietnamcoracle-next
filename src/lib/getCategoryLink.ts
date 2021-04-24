export default function getCategoryLink(uri: string): string {
  return uri.replace('/category/features-guides/', '/browse/');
}
