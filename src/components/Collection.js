import cx from 'classnames';
import { gql } from 'graphql-request';
import _shuffle from 'lodash/shuffle';
import { useMemo } from 'react';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import useCarousel from '../lib/useCarousel';
import PostCard from './PostCard';

const Collection = ({ data, swatches }) => {
  const {
    getLeftNavProps,
    getRightNavProps,
    isTouchDevice,
    scrollAreaRef,
    scrollPosition,
  } = useCarousel({ offsetLeft: 64 });
  const posts = useMemo(() => {
    let posts;
    switch (data.type) {
      case 'category':
        posts = data.category.posts.nodes;
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
            ? new Date(a.date) - new Date(b.date)
            : new Date(b.date) - new Date(a.date),
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
    <div className="relative my-3">
      {!isTouchDevice && scrollPosition && scrollPosition !== 'start' && (
        <button
          className="absolute z-10 left-0 h-full bg-black bg-opacity-75 text-white"
          {...getLeftNavProps()}>
          <ChevronLeft classes={{ root: 'w-10 h-10' }} />
        </button>
      )}
      {!isTouchDevice && scrollPosition && scrollPosition !== 'end' && (
        <button
          className="absolute z-10 right-0 h-full bg-black bg-opacity-50 dark:bg-opacity-75 text-white"
          {...getRightNavProps()}>
          <ChevronRight classes={{ root: 'w-10 h-10' }} />
        </button>
      )}
      <div className="overflow-hidden">
        <ol
          className="flex pb-8 -mb-8 pl-4 lg:pl-12 overflow-y-auto"
          ref={scrollAreaRef}>
          {posts.map((post, index) => (
            <li
              className={cx(
                'flex flex-shrink-0',
                index < posts.length - 1 ? 'pr-2' : 'pr-4 lg:pr-12',
              )}
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
  }
  fragment CollectionComponentData on Component_Collections_items {
    direction
    orderby
    type
    category {
      posts {
        nodes {
          ...CollectionComponentPostData
          ...PostCardPostData
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
