import _flatten from 'lodash/flatten';
import _upperFirst from 'lodash/upperFirst';
import { Metadata } from 'next';
import { SearchParams } from 'next/dist/server/request/search-params';
import { headers } from 'next/headers';
import { userAgent } from 'next/server';
import SearchResults from './components/SearchResults';

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

  return <SearchResults query={query} />;
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
