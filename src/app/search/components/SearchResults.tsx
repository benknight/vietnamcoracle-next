'use client';
import cx from 'classnames';
import _flatten from 'lodash/flatten';
import _upperFirst from 'lodash/upperFirst';
import { useState } from 'react';
import useSWR from 'swr';
import useWaitCursor from '../../../lib/useWaitCursor';
import { fetchAlgoliaResults, fetchWpResults } from '../actions';
import PostMediaBlock from '../../../components/PostMediaBlock';

export default function SearchResults({ query }: { query: String }) {
  const [pageCount, setPageCount] = useState(1);
  const [source, setSource] = useState<'algolia' | 'wp'>('algolia');

  return (
    <>
      {[...Array(pageCount)].map((_item, i) => (
        <SearchResultsPage
          index={i}
          isLastPage={i === pageCount - 1}
          key={i}
          query={query ? String(query) : ''}
          onClickMore={() => setPageCount(x => x + 1)}
          onError={error => {
            console.error(error);
            if (source === 'algolia') {
              setPageCount(1);
              setSource('wp');
            }
          }}
          pageSize={source === 'algolia' ? 100 : 10}
          source={source}
        />
      ))}
    </>
  );
}

function SearchResultsPage({
  index = 0,
  pageSize,
  query = '',
  isLastPage = false,
  onClickMore,
  onError,
  source = '',
}) {
  const request = useSWR(
    query === '' || typeof window === 'undefined'
      ? null
      : [query, index + 1, pageSize, source],
    source === 'algolia' ? fetchAlgoliaResults : fetchWpResults,
    {
      onError,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    },
  );
  const { data, error } = request;
  const isLoading = typeof window === 'undefined' || request.isLoading;
  const posts = data ? _flatten(data) : [];
  const showSeaching = index === 0 && isLoading;
  const noResults = index === 0 && !isLoading && !error && posts.length === 0;

  useWaitCursor(isLoading);

  let status;

  if (showSeaching) {
    status = <>Searching…</>;
  } else if (noResults) {
    status = (
      <>
        No results found for <em>{query}</em>
      </>
    );
  } else if (index === 0) {
    status = (
      <>
        Search results for ‘<em>{query}</em>’
      </>
    );
  }

  return (
    <>
      {status && (
        <div className="py-4 lg:pt-12 ml-2 sm:ml-4 lg:ml-0 mr-8 lg:font-display lg:text-xl">
          {status}
        </div>
      )}
      {posts.map(post => (
        <PostMediaBlock key={post.slug} post={post} />
      ))}
      {isLastPage &&
        !noResults &&
        !isLoading &&
        (source === 'algolia' || posts.length < pageSize) && (
          <div className="text-sm text-center italic">End of results.</div>
        )}
      <button
        className={cx('btn w-full h-12 lg:h-10 lg:w-auto my-4 lg:mb-24', {
          'opacity-50': isLoading,
          hidden:
            source === 'algolia' ||
            !isLastPage ||
            (isLoading && index === 0) ||
            (!isLoading && posts.length < pageSize),
        })}
        disabled={isLoading}
        onClick={onClickMore}>
        Load More Results
      </button>
    </>
  );
}
