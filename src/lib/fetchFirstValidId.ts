import { RestClientAdmin } from './RestClient';

export default async function fetchFirstValidId(
  slug: string,
  endpoints: string[],
): Promise<number | null> {
  for (let endpoint of endpoints) {
    const url = `/${endpoint}?slug=${encodeURIComponent(
      slug,
    )}&_fields=id&status=private,publish`;

    const response = await RestClientAdmin.get(url);

    if (response.data?.[0]?.id) {
      return response.data[0].id;
    }
  }
  return null;
}
