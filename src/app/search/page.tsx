import _flatten from 'lodash/flatten';
import _upperFirst from 'lodash/upperFirst';
import { Metadata } from 'next';
import { SearchParams } from 'next/dist/server/request/search-params';
import { draftMode, headers } from 'next/headers';
import { userAgent } from 'next/server';
import Footer from '../../components/Footer';
import Layout, { LayoutMain, LayoutSidebar } from '../../components/Layout';
import SidebarDefault from '../../components/SidebarDefault';
import SearchResults from './components/SearchResults';
import getGQLClient from '../../lib/getGQLClient';
import SidebarQuery from '../../queries/Sidebar.gql';
import Header from '../../components/Header';

interface Props {
  searchParams: Promise<SearchParams>;
}

export default async function Search(props: Props) {
  const { query } = await props.searchParams;
  const isBot = userAgent({ headers: await headers() }).isBot;

  if (isBot) {
    return null;
  }

  if (!query) {
    throw new Error('Search query is missing');
  }

  if (typeof query !== 'string') {
    throw new Error('Search query must be a string');
  }

  const { isEnabled: preview } = await draftMode();

  const api = getGQLClient(preview ? 'preview' : 'admin');

  const blockData = await api.request(SidebarQuery);

  return (
    <>
      <Header preview={preview} />
      <div className="bg-gray-100 dark:bg-transparent">
        <Layout className="max-w-screen-2xl pb-14 xl:pb-0 bg-white dark:bg-transparent">
          <LayoutMain className="min-h-screen bg-gray-100 dark:bg-black lg:bg-transparent">
            <div className="px-2 lg:px-8 pb-8">
              <SearchResults query={query} />
            </div>
          </LayoutMain>
          <LayoutSidebar>
            <SidebarDefault blocks={blockData} className="xl:!pt-16" />
            <Footer />
          </LayoutSidebar>
        </Layout>
      </div>
    </>
  );
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { query } = await searchParams;
  return {
    title: `Search results for ${query}`,
    description: `Search results for ${query}`,
  };
}
