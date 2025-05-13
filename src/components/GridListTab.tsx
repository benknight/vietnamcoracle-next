'use client';
import cx from 'classnames';
import { TabPanel, TabPanels, TabGroup, TabList, Tab } from '@headlessui/react';
import { Squares2X2Icon } from '@heroicons/react/24/solid';
import ViewListIcon from '@mui/icons-material/ViewList';
import PostCard from './PostCard';
import PostMediaBlock from './PostMediaBlock';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

const tabCx = (selected: boolean, className = '') =>
  cx(
    className,
    'inline-flex items-center p-2 sm:p-3 text-sm leading-5 font-medium rounded-lg focus:outline-none focus-visible:ring-2 ring-offset-2 ring-offset-primary-400 ring-white ring-opacity-60',
    selected
      ? 'bg-white shadow text-primary-600'
      : 'text-primary-400 text-opacity-75 hover:text-opacity-100',
  );

export function GridListTabGroup({ hideList = false, posts }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  return (
    <TabGroup
      as="div"
      className="pb-8 min-h-screen bg-gray-100 dark:bg-black lg:bg-transparent"
      defaultIndex={
        searchParams ? parseInt(searchParams.get('tabIndex') ?? '0') || 0 : 0
      }
      manual
      onChange={index => {
        const params = new URLSearchParams(searchParams?.toString());
        params.set('tabIndex', index.toString());
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }}>
      <div
        className={cx(
          'pt-8 md:pt-6 px-2 lg:px-8 justify-center lg:justify-start',
          hideList ? 'hidden' : 'flex',
        )}>
        <GridListTabList />
      </div>
      <TabPanels>
        <TabPanel>
          <div className="px-2 lg:px-8 pt-6 grid gap-4 xl:gap-6 md:grid-cols-2">
            {posts.map(post => (
              <PostCard key={post.slug} post={post} inGrid />
            ))}
          </div>
        </TabPanel>
        <TabPanel>
          <div className="px-2 py-4 lg:px-8">
            {posts
              .map(post => ({
                ...post,
                image: {
                  altText: post.featuredImage.node.altText,
                  src: post.featuredImage.node.srcMedium,
                },
              }))
              .map(post => (
                <PostMediaBlock key={post.slug} post={post} />
              ))}
          </div>
        </TabPanel>
      </TabPanels>
    </TabGroup>
  );
}

export function GridListTabList({ hideLabels = false }) {
  return (
    <TabList className="flex p-1 -mx-1 bg-black dark:bg-white bg-opacity-5 dark:bg-opacity-10 rounded-xl">
      <Tab
        className={({ selected }) => tabCx(selected)}
        style={{ WebkitTapHighlightColor: 'transparent' }}>
        <Squares2X2Icon className="w-5 h-5" />
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
    </TabList>
  );
}
