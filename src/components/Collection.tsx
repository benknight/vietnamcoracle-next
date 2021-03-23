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
  const posts = useMemo(() => {
    let posts;
    switch (data.type) {
      case 'category':
        posts = data.category?.posts.nodes ?? [];
        break;
      case 'manual':
        posts = data.posts;
        break;
      default:
        posts = [];
        break;
    }
    switch (data.orderby) {
      case 'date':
        posts.sort((a, b) =>
          data.direction === 'asc'
            ? new Date(a.date).getTime() - new Date(b.date).getTime()
            : new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        break;
      case 'alpha':
        posts.sort((a, b) =>
          data.direction === 'asc' ? a.title - b.title : b.title - a.title,
        );
        break;
      case 'random':
      default:
        posts = _shuffle(posts);
        break;
    }
    return posts;
  }, [data]);
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
          {posts.map((post, index) => (
            <li
              className="flex flex-shrink-0 w-3/7 md:w-3/8 lg:w-3/7 pr-3 md:pr-4 lg:pr-3"
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
  fragment CollectionComponentPostData on Post {
    slug
    ...PostCardPostData
  }
  fragment CollectionComponentData on CategoryPage_Collections_items {
    direction
    orderby
    type
    category {
      posts(first: 10) {
        nodes {
          ...CollectionComponentPostData
        }
      }
    }
    posts {
      ... on Post {
        ...CollectionComponentPostData
      }
    }
  }
  ${PostCard.fragments}
`;

export default Collection;
