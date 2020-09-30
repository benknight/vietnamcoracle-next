import cx from 'classnames';
import { graphql } from 'gatsby';
import _shuffle from 'lodash/shuffle';
import React from 'react';

export default function Collection({ data }) {
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
  return (
    <ol className="flex py-3 overflow-x-auto">
      {posts.map((post, index) => (
        <li
          className={cx('px-1 flex flex-shrink-0', {
            'pr-4 lg:pr-0': index === posts.length - 1,
            'pl-4 lg:pl-8': index === 0,
          })}
          title={post.slug}
          key={post.slug}>
          <a
            className="
              relative overflow-hidden
              flex flex-col w-32 sm:w-40 md:w-48
              rounded md:rounded-lg shadow"
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
              className="relative block w-full h-24 sm:h-32 md:h-40 object-cover"
              loading="lazy"
              sizes={post.thumbnails.thumbnailSquare.sizes}
              srcSet={post.thumbnails.thumbnailSquare.srcSet}
            />
            <div
              className="
                backdrop-blur relative bg-gray-800 bg-opacity-25
                p-2 sm:p-3 flex-auto flex items-center
                text-white font-medium rounded-b md:rounded-b-lg">
              <h3
                className={cx('sm:text-sm leading-tight font-sans', {
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
