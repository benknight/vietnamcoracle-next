import cx from 'classnames';
import _shuffle from 'lodash/shuffle';
import React from 'react';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import useCarousel from '../lib/useCarousel';

export default function Collection({ data }) {
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
      <ol className="flex lg:pl-12" ref={scrollAreaRef}>
        {posts.map((post, index) => (
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
                rounded shadow"
              href={`https://www.vietnamcoracle.com${post.link}`}>
              <img
                alt={post.thumbnails.thumbnailSquare.altText}
                className="absolute block w-full h-full object-cover"
                loading="lazy"
                sizes={post.thumbnails.thumbnailSquare.sizes}
                srcSet={post.thumbnails.thumbnailSquare.srcSet}
              />
              <img
                alt={post.thumbnails.thumbnailSquare.altText}
                className="relative block w-full h-32 sm:h-32 md:h-40 object-cover"
                loading="lazy"
                sizes={post.thumbnails.thumbnailSquare.sizes}
                srcSet={post.thumbnails.thumbnailSquare.srcSet}
              />
              <div
                className="
                backdrop-blur relative bg-gray-800 bg-opacity-25
                p-2 sm:p-3 flex-auto flex items-center
                text-white font-medium rounded-b">
                <h3
                  className={cx('sm:text-sm leading-tight font-serif', {
                    'text-xs sm:text-sm md:text-base': post.title.length > 40,
                    'text-sm sm:text-base md:text-lg': post.title.length <= 40,
                  })}>
                  {post.title}
                </h3>
              </div>
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}

export const query = graphql`
  fragment CollectionComponentPostData on WpPost {
    date
    link
    slug
    title
    thumbnails {
      thumbnailSquare {
        altText
        srcSet
        sizes
      }
    }
  }
  fragment CollectionComponentData on WpComponent_Collections_items {
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
      ... on WpPost {
        ...CollectionComponentPostData
      }
    }
  }
`;
