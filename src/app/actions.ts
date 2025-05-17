'use server';
import GraphQLClient from '../lib/WPGraphQLClient';
import MenuQuery from '../queries/Menu.gql';

// How long to cache the response for
const maxAgeSeconds = 60 * 60 * 1; // 1 hours

const api = new GraphQLClient('admin', {
  next: { revalidate: maxAgeSeconds },
});

export async function fetchMenu(): Promise<{
  menuItems: {
    nodes: {
      id: string;
      label: string;
      parentId: string | null;
      path: string;
      url: string;
    }[];
  };
}> {
  return await api.request(MenuQuery);
}
