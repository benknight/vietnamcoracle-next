import cx from 'classnames';
import { gql } from 'graphql-request';
import _shuffle from 'lodash/shuffle';
import { useMemo, RefObject } from 'react';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
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
          className="absolute z-10 left-2 top-1/2 transform -translate-y-1/2 w-16 h-16 rounded-full bg-black bg-opacity-75 text-white"
          {...getLeftNavProps()}>
          <ChevronLeft classes={{ root: 'w-10 h-10' }} />
        </button>
      )}
      {!isTouchDevice && scrollPosition && scrollPosition !== 'end' && (
        <button
          className="absolute z-10 top-1/2 right-2 transform -translate-y-1/2 w-16 h-16 rounded-full bg-black bg-opacity-75 text-white"
          {...getRightNavProps()}>
          <ChevronRight classes={{ root: 'w-10 h-10' }} />
        </button>
      )}
      <div className="overflow-hidden">
        <ol
          className="flex pb-8 -mb-8 pl-4 md:pl-8 lg:pl-8 xl:pl-12 overflow-y-auto"
          ref={scrollAreaRef as RefObject<HTMLOListElement>}>
          {data.posts?.map(post => (
            <li
              className="flex flex-shrink-0 w-3/7 lg:w-3/8 xl:w-3/7 pr-3 lg:pr-4 xl:pr-3"
              title={post.slug}
              key={post.slug}>
              <PostCard post={post} />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

Collection.fragments = gql`
  fragment CollectionComponentData on CategoryPage_Collections_items {
    posts {
      ... on Post {
        slug
        ...PostCardPostData
      }
    }
  }
  ${PostCard.fragments}
`;

export default Collection;
