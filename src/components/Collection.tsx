import cx from 'classnames';
import _shuffle from 'lodash/shuffle';
import { RefObject, useMemo } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/outline';
import useCarousel from '../lib/useCarousel';
import PostCard from './PostCard';

const Collection = ({ ad, data }) => {
  const {
    getLeftNavProps,
    getRightNavProps,
    isTouchDevice,
    scrollAreaRef,
    scrollPosition,
  } = useCarousel();
  const navButtonClassName =
    'flex items-center justify-center absolute z-10 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-black hover:bg-blue-400 transition-colors duration-50 ease-out bg-opacity-75 text-white top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-black hover:bg-blue-400 transition-colors duration-50 ease-out bg-opacity-75 text-white';
  const items = useMemo(() => {
    const posts = data.posts.filter(post => !!post.featuredImage);
    const mapPosts = post => ({
      type: 'post',
      data: post,
    });
    if (!ad?.enabled) return data.posts.map(mapPosts);
    return [
      ...posts.slice(0, ad.position - 1).map(mapPosts),
      { type: 'ad', data: ad },
      ...posts.slice(ad.position - 1).map(mapPosts),
    ];
  }, [ad, data.posts]);
  return (
    <div className="relative my-3 lg:my-4 overflow-hidden">
      {!isTouchDevice && scrollPosition && (
        <button
          className={cx(
            navButtonClassName,
            'left-2',
            scrollPosition === 'start' && 'opacity-0',
          )}
          {...getLeftNavProps()}>
          <ArrowLeftIcon className="w-7 h-7" />
        </button>
      )}
      {!isTouchDevice && scrollPosition && (
        <button
          className={cx(
            navButtonClassName,
            'right-2',
            scrollPosition === 'end' && 'opacity-0',
          )}
          {...getRightNavProps()}>
          <ArrowRightIcon className="w-7 h-7" />
        </button>
      )}
      <div className="overflow-hidden">
        <ol
          className="sm:snap-x xl:snap-none flex pb-8 -mb-8 pr-4 md:pr-8 overflow-y-auto"
          ref={scrollAreaRef as RefObject<HTMLOListElement>}>
          {items?.map((item, index) => (
            <li
              className="snap-start flex shrink-0 w-4/5 sm:w-3/7 lg:w-1/3 xl:min-w-[20rem] xl:max-w-[25rem] py-1 pl-3 lg:pl-4 xl:pl-3 2xl:pl-6 md:first:pl-8"
              key={index}>
              <PostCard
                {...(item.type === 'ad'
                  ? { ad: item.data }
                  : { post: item.data })}
              />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default Collection;
