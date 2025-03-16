import cx from 'classnames';
import { useMemo } from 'react';
import { Tab } from '@headlessui/react';
import { ViewGridIcon } from '@heroicons/react/solid';
import ViewListIcon from '@mui/icons-material/ViewList';
import { useRouter } from 'next/router';
import PostCard from './PostCard';
import PostMediaBlock from './PostMediaBlock';

const tabCx = (selected: boolean, className = '') =>
  cx(
    className,
    'inline-flex items-center p-2 sm:p-3 text-sm leading-5 font-medium rounded-lg focus:outline-none focus-visible:ring-2 ring-offset-2 ring-offset-primary-400 ring-white ring-opacity-60',
    selected
      ? 'bg-white shadow text-primary-600'
      : 'text-primary-400 text-opacity-75 hover:text-opacity-100',
  );

function Group({ hideList = false, posts }) {
  const router = useRouter();
  const searchParams = useMemo(
    () =>
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search)
        : undefined,
    [typeof window],
  );
  return (
    <Tab.Group
      as="div"
      className="pb-8 min-h-screen bg-gray-100 dark:bg-black lg:bg-transparent"
      defaultIndex={
        searchParams?.has('tabIndex')
          ? parseInt(searchParams.get('tabIndex')) || 0
          : 0
      }
      manual
      // @ts-ignore
      onChange={index => {
        router.replace(
          {
            pathname: router.pathname,
            query: { ...router.query, tabIndex: index },
          },
          undefined,
          {
            shallow: true,
          },
        );
      }}>
      <div
        className={cx(
          'pt-8 md:pt-6 px-2 lg:px-8 justify-center lg:justify-start',
          hideList ? 'hidden' : 'flex',
        )}>
        <List />
      </div>
      <Tab.Panels>
        <Tab.Panel>
          <div className="px-2 lg:px-8 pt-6 grid gap-4 xl:gap-6 md:grid-cols-2">
            {posts.map(post => (
              <PostCard key={post.slug} post={post} inGrid />
            ))}
          </div>
        </Tab.Panel>
        <Tab.Panel>
          <div className="px-2 py-4 lg:px-8">
            {posts.map(post => (
              <PostMediaBlock key={post.slug} post={post} />
            ))}
          </div>
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
}

function List({ hideLabels = false }) {
  return (
    <Tab.List className="flex p-1 -mx-1 bg-black dark:bg-white bg-opacity-5 dark:bg-opacity-10 rounded-xl">
      <Tab
        className={({ selected }) => tabCx(selected)}
        style={{ WebkitTapHighlightColor: 'transparent' }}>
        <ViewGridIcon className="w-5 h-5" />
        <span className={cx('ml-1', { 'hidden md:inline-block': hideLabels })}>
          {' '}
          Grid
        </span>
      </Tab>
      <Tab
        className={({ selected }) => tabCx(selected, 'ml-1')}
        style={{ WebkitTapHighlightColor: 'transparent' }}>
        <ViewListIcon className="w-5 h-5" />
        <span
          className={cx('ml-1.5', { 'hidden md:inline-block': hideLabels })}>
          {' '}
          List
        </span>
      </Tab>
    </Tab.List>
  );
}

export default {
  Group,
  List,
};
