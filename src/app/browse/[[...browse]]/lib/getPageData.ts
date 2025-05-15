import getGQLClient from '../../../../lib/getGQLClient';
import BrowseCategoryQuery from '../../../../queries/BrowseCategory.gql';

export default async function getPageData(browse: string[], preview: Boolean) {
  const api = getGQLClient(preview ? 'preview' : 'admin');
  const categorySlug = browse?.[0] ?? 'features-guides';
  const subcategorySlug = browse?.[1] ?? '';

  return api.request(BrowseCategoryQuery, {
    categorySlug,
    subcategorySlug,
    hasSubcategory: Boolean(subcategorySlug),
    preview,
    skipCategoryPosts:
      Boolean(subcategorySlug) ||
      [
        'features-guides',
        'motorbike-guides',
        'food-and-drink',
        'hotel-reviews',
        'destinations',
      ].includes(categorySlug),
  });
}
