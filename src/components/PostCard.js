import cx from 'classnames';
import { gql } from 'graphql-request';
import _get from 'lodash/get';
import Image from 'next/image';
import Link from 'next/link';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import swatches from '../json/swatches.json';

function PostCard({ post, size = 'small' }) {
  const isDark = useMediaQuery('(prefers-color-scheme: dark)');
  const swatchKey = 'DarkMuted';
  const swatch = _get(
    swatches,
    [post.thumbnails.thumbnailSquare.id, swatchKey],
    {},
  );
  return (
    <Link href={`/posts/${post.slug}`}>
      <a
        className={cx('relative overflow-hidden flex flex-col w-full shadow', {
          rounded: size === 'small',
          'rounded-lg': size === 'medium',
        })}>
        <div
          className={cx('relative block w-full bg-opacity-10', {
            'h-32 md:h-48': size === 'small',
            'h-48 lg:h-72': size === 'medium',
          })}
          style={{
            backgroundColor: swatch.hex,
          }}>
          <Image
            alt={post.thumbnails.thumbnailSquare.altText}
            className="object-cover"
            layout="fill"
            loading="lazy"
            src={post.thumbnails.thumbnailSquare.sourceUrl}
          />
        </div>
        <div
          className={cx(
            'relative flex-auto flex',
            'text-white bg-gray-900  font-medium rounded-b',
            {
              'p-2 sm:p-3 items-center': size === 'small',
              'p-3 sm:px-5 sm:py-6': size === 'medium',
            },
          )}>
          <Image
            alt=""
            className="object-bottom object-cover opacity-50"
            layout="fill"
            loading="lazy"
            src={`/fx/${post.thumbnails.thumbnailSquare.slug}.jpg`}
          />
          <div className="relative font-serif">
            <h3
              className={cx('leading-tight', {
                'text-xs sm:text-sm md:text-base':
                  post.title.length > 40 && size === 'small',
                'text-sm sm:text-base md:text-lg':
                  post.title.length <= 40 && size === 'small',
                'text-sm sm:text-base lg:text-2xl': size === 'medium',
              })}>
              {post.title}
            </h3>
            {size === 'medium' && (
              <div
                className="mt-1 text-sm opacity-75"
                dangerouslySetInnerHTML={{ __html: post.excerpt }}
              />
            )}
          </div>
        </div>
      </a>
    </Link>
  );
}

PostCard.fragments = gql`
  fragment PostCardPostData on Post {
    excerpt
    slug
    title
    thumbnails {
      thumbnailSquare {
        __typename
        altText
        id
        sourceUrl(size: LARGE)
        processImagesSourceUrl: sourceUrl(size: THUMBNAIL)
        slug
      }
    }
  }
`;

export default PostCard;
