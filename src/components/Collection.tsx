import cx from 'classnames';
import _shuffle from 'lodash/shuffle';
import { RefObject } from 'react';
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
  return (
    <div className="relative my-3 lg:my-4 rounded-r-lg overflow-hidden">
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
          className="flex pb-8 -mb-8 pl-4 md:pl-8 overflow-y-auto"
          ref={scrollAreaRef as RefObject<HTMLOListElement>}>
          {data.posts?.map((post, index) => (
            <li
              className="flex shrink-0 w-4/5 sm:w-3/7 lg:w-3/8 xl:w-3/7 xl:min-w-[23rem] xl:max-w-[25rem] pr-3 lg:pr-4 xl:pr-3 2xl:pr-6"
              key={post.slug}>
              <PostCard
                {...(ad?.enabled && index === ad.position - 1
                  ? { ad }
                  : { post })}
              />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default Collection;
