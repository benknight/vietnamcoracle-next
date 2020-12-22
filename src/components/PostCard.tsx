import cx from 'classnames';
import { gql } from 'graphql-request';
import _get from 'lodash/get';
import Image from 'next/image';
import Link from 'next/link';
// import useMediaQuery from '@material-ui/core/useMediaQuery';
import swatches from '../json/swatches.json';

const fragments = gql`
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
        sourceUrlFx: sourceUrl(size: MEDIUM)
        slug
      }
    }
  }
`;

interface Props {
  post: any;
  size?: 'small' | 'medium';
}

function PostCard({ post, size = 'small' }: Props) {
  // const isDark = useMediaQuery('(prefers-color-scheme: dark)');
  const swatchKey = 'DarkMuted';
  const swatch = _get(
    swatches,
    [post.thumbnails.thumbnailSquare.id, swatchKey],
    {},
  );
  return (
    <Link href={`/posts/${post.slug}`}>
      <a className="post-card relative overflow-hidden flex flex-col w-full shadow rounded-lg">
        <div
          className={cx('relative block w-full bg-opacity-10', {
            'h-40 md:h-48': size === 'small',
            'h-60 md:h-72': size === 'medium',
          })}
          style={{
            backgroundColor: swatch.hex,
          }}>
          <Image
            alt={post.thumbnails.thumbnailSquare.altText}
            layout="fill"
            loading="lazy"
            objectFit="cover"
            src={`https://res.cloudinary.com/vietnam-coracle/image/fetch/${post.thumbnails.thumbnailSquare.sourceUrl}`}
          />
        </div>
        <div
          className={cx(
            'relative flex-auto flex',
            'text-white bg-gray-900 font-medium rounded-b',
            {
              'p-3 items-center': size === 'small',
              'px-4 py-5 sm:px-5 sm:py-6': size === 'medium',
            },
          )}>
          <Image
            alt=""
            className="object-bottom object-cover opacity-50"
            layout="fill"
            loading="eager"
            src={`https://res.cloudinary.com/vietnam-coracle/image/fetch/t_post_card/${post.thumbnails.thumbnailSquare.sourceUrlFx}`}
            unoptimized
          />
          <div className="relative font-serif antialiased">
            <h3
              className={cx('leading-tight', {
                'text-sm md:text-base':
                  post.title.length > 40 && size === 'small',
                'text-base md:text-lg':
                  post.title.length <= 40 && size === 'small',
                'text-xl sm:text-2xl md:text-xl lg:text-2xl': size === 'medium',
              })}>
              {post.title}
            </h3>
            {size === 'medium' && (
              <div
                className="mt-2 text-xs sm:text-sm md:text-xs lg:text-sm opacity-75"
                dangerouslySetInnerHTML={{ __html: post.excerpt }}
              />
            )}
          </div>
        </div>
      </a>
    </Link>
  );
}

PostCard.fragments = fragments;

export default PostCard;
