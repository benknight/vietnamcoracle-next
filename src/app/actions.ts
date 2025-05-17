'use server';
import GraphQLClient from '../lib/WPGraphQLClient';
import MenuQuery from '../queries/Menu.gql';
import SidebarQuery from '../queries/Sidebar.gql';
import { BlockData } from '../components/Block';

// How long to cache the response for
const maxAgeSeconds = 60 * 60 * 1; // 1 hours

const api = new GraphQLClient('admin', {
  next: { revalidate: maxAgeSeconds },
});

export async function fetchSidebarBlocks(): Promise<{
  about: { block: BlockData };
  subscribe: { block: BlockData };
  support: { block: BlockData };
}> {
  return await api.request(SidebarQuery);
}

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
