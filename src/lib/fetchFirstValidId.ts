import RestClient from './WPRestClient';

export default async function fetchFirstValidId(
  slug: string,
  postTypes: string[],
): Promise<number | null> {
  const api = new RestClient('admin');

  for (let postType of postTypes) {
    const url = `/wp/v2/${postType}?slug=${encodeURIComponent(
      slug,
    )}&_fields=id&status=private,publish`;

    const response = await api.get(url);

    if (response?.[0]?.id) {
      return response[0].id;
    }
  }

  return null;
}
