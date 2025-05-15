'use server';
import GraphQLClient from '../lib/WPGraphQLClient';
import SidebarQuery from '../queries/Sidebar.gql';
import { BlockData } from '../components/Block';

export default async function fetchSidebarBlocks(): Promise<{
  about: { block: BlockData };
  subscribe: { block: BlockData };
  support: { block: BlockData };
}> {
  const api = new GraphQLClient('admin');
  const result = await api.request(SidebarQuery);
  return result;
}
