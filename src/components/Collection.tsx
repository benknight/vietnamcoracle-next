import { gql } from 'graphql-request';
import _shuffle from 'lodash/shuffle';
import { RefObject } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/outline';
import useCarousel from '../lib/useCarousel';
import PostCard from './PostCard';

const Collection = ({ data }) => {
  const {
    getLeftNavProps,
    getRightNavProps,
    isTouchDevice,
    scrollAreaRef,
    scrollPosition,
  } = useCarousel();
  return (
    <div className="relative my-3 lg:my-4 rounded-r-lg overflow-hidden">
      {!isTouchDevice && scrollPosition && scrollPosition !== 'start' && (
        <button
          className="flex items-center justify-center absolute z-10 left-2 top-1/2 transform -translate-y-1/2 w-16 h-16 rounded-full bg-black bg-opacity-75 text-white"
          {...getLeftNavProps()}>
          <ArrowLeftIcon className="w-7 h-7" />
        </button>
      )}
      {!isTouchDevice && scrollPosition && scrollPosition !== 'end' && (
        <button
          className="flex items-center justify-center absolute z-10 top-1/2 right-2 transform -translate-y-1/2 w-16 h-16 rounded-full bg-black bg-opacity-75 text-white"
          {...getRightNavProps()}>
          <ArrowRightIcon className="w-7 h-7" />
        </button>
      )}
      <div className="overflow-hidden">
        <ol
          className="flex pb-8 -mb-8 pl-4 md:pl-8 overflow-y-auto"
          ref={scrollAreaRef as RefObject<HTMLOListElement>}>
          {data.posts?.map(post => (
            <li
              className="flex flex-shrink-0 w-4/5 sm:w-3/7 lg:w-3/8 xl:w-3/7 xl:min-w-[23rem] xl:max-w-[25rem] pr-3 lg:pr-4 xl:pr-3 2xl:pr-6"
              key={post.slug}>
              <PostCard data={post} />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

Collection.fragments = gql`
  fragment CollectionComponentData on Category_Collections_items {
    posts {
      ... on Post {
        slug
        ...PostCardData
      }
    }
  }
  ${PostCard.fragments}
`;

export default Collection;
