import cx from 'classnames';
import { graphql } from 'gatsby';
import React from 'react';

export default function Collection({ item }) {
  return (
    <section className="my-2 md:my-8">
      <h3 className="px-4 lg:px-8 text-lg sm:text-xl md:text-2xl lg:text-3xl font-display">
        {item.title}
      </h3>
      <ol className="flex py-2 overflow-x-auto">
        {item.category.posts.nodes.map((post, index) => (
          <li
            className={cx('px-1 flex flex-shrink-0', {
              'pr-4 lg:pr-8': index === item.category.posts.length - 1,
              'pl-4 lg:pl-8': index === 0,
            })}
            title={post.slug}
            key={post.slug}>
            <a
              className="
              relative overflow-hidden
              flex flex-col w-32 sm:w-40 md:w-48 lg:w-56
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
                className="relative block w-full h-24 sm:h-32 md:h-40 lg:h-48 object-cover"
                loading="lazy"
                sizes={post.thumbnails.thumbnailSquare.sizes}
                srcSet={post.thumbnails.thumbnailSquare.srcSet}
              />
              <div
                className="
                backdrop-blur relative
                p-2 sm:p-3 flex-auto flex items-center
                text-white font-medium rounded-b md:rounded-b-lg">
                <h3
                  className={cx('sm:text-sm leading-tight font-sans', {
                    'text-xs sm:text-sm md:text-base lg:text-lg':
                      post.title.length > 40,
                    'text-sm sm:text-base md:text-lg lg:text-xl':
                      post.title.length <= 40,
                  })}>
                  {post.title}
                </h3>
              </div>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}

export const query = graphql`
  fragment CollectionComponentData on WpComponent_Collections_items {
    title
    category {
      posts {
        nodes {
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
      }
    }
  }
`;
