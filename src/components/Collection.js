import cx from 'classnames';
import { gql } from 'graphql-request';
import _shuffle from 'lodash/shuffle';
import React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import useCarousel from '../lib/useCarousel';

const Collection = ({ data, swatches }) => {
  const {
    getLeftNavProps,
    getRightNavProps,
    isTouchDevice,
    scrollAreaRef,
    scrollPosition,
  } = useCarousel({ offsetLeft: 64 });
  const posts = React.useMemo(() => {
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
  const isDark = useMediaQuery('(prefers-color-scheme: dark)');
  return (
    <div className="relative my-3">
      {!isTouchDevice && scrollPosition && scrollPosition !== 'start' && (
        <button
          className="absolute z-10 left-0 h-full bg-black bg-opacity-50 text-white"
          {...getLeftNavProps()}>
          <ChevronLeft classes={{ root: 'w-10 h-10' }} />
        </button>
      )}
      {!isTouchDevice && scrollPosition && scrollPosition !== 'end' && (
        <button
          className="absolute z-10 right-0 h-full bg-black bg-opacity-50 text-white"
          {...getRightNavProps()}>
          <ChevronRight classes={{ root: 'w-10 h-10' }} />
        </button>
      )}
      <div className="overflow-hidden">
        <ol
          className="flex pb-8 -mb-8 lg:pl-12 overflow-y-auto"
          ref={scrollAreaRef}>
          {posts.map((post, index) => {
            const swatch =
              swatches[post.thumbnails.thumbnailSquare.id][
                isDark ? 'DarkMuted' : 'DarkMuted'
              ];
            return (
              <li
                className={cx(
                  'flex flex-shrink-0',
                  index < posts.length - 1 ? 'pr-2' : 'lg:pr-12',
                )}
                title={post.slug}
                key={post.slug}>
                <a
                  className="
                relative overflow-hidden
                flex flex-col w-40 sm:w-40 md:w-48
                rounded"
                  href={`https://www.vietnamcoracle.com${post.link}`}>
                  <img
                    alt={post.thumbnails.thumbnailSquare.altText}
                    className="relative block w-full h-32 sm:h-32 md:h-40 object-cover"
                    loading="lazy"
                    sizes={post.thumbnails.thumbnailSquare.sizes}
                    srcSet={post.thumbnails.thumbnailSquare.srcSet}
                  />
                  <div
                    className="
                  relative bg-gray-800 bg-opacity-25
                  p-2 sm:p-3 flex-auto flex items-center
                  font-medium rounded-b"
                    style={{
                      backgroundColor: swatch.hex,
                      color: swatch.titleTextColor,
                    }}>
                    <h3
                      className={cx('sm:text-sm leading-tight font-serif', {
                        'text-xs sm:text-sm md:text-base':
                          post.title.length > 40,
                        'text-sm sm:text-base md:text-lg':
                          post.title.length <= 40,
                      })}>
                      {post.title}
                    </h3>
                  </div>
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
};

Collection.fragments = gql`
  fragment CollectionComponentPostData on Post {
    date
    link
    slug
    title
    thumbnails {
      thumbnailSquare {
        altText
        id
        srcSet
        sizes
      }
    }
  }
  fragment CollectionComponentData on Component_Collections_items {
    direction
    orderby
    type
    category {
      posts {
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
`;

export default Collection;
