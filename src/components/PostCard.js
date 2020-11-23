import cx from 'classnames';
import { gql } from 'graphql-request';
import _get from 'lodash/get';
import Image from 'next/image';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import swatches from '../json/swatches.json';

function PostCard({ post }) {
  const isDark = useMediaQuery('(prefers-color-scheme: dark)');
  const swatchKey = isDark ? 'DarkMuted' : 'LightMuted';
  const swatch = _get(
    swatches,
    [post.thumbnails.thumbnailSquare.id, swatchKey],
    {},
  );
  return (
    <a
      className="
        relative overflow-hidden
        flex flex-col w-40 sm:w-40 md:w-56 rounded"
      href={`https://www.vietnamcoracle.com${post.link}`}>
      <div
        className="relative block w-full h-32 sm:h-32 md:h-48 bg-opacity-10"
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
        className="relative text-white
          p-2 sm:p-3 flex-auto flex items-center
          font-medium rounded-b"
        style={{
          backgroundColor: swatch.hex,
        }}>
        <Image
          alt=""
          className="object-bottom object-cover opacity-75"
          layout="fill"
          loading="lazy"
          src={`/fx/${post.thumbnails.thumbnailSquare.slug}.jpg`}
        />
        <h3
          className={cx('relative sm:text-sm leading-tight font-serif', {
            'text-xs sm:text-sm md:text-base': post.title.length > 40,
            'text-sm sm:text-base md:text-lg': post.title.length <= 40,
          })}>
          {post.title}
        </h3>
      </div>
    </a>
  );
}

PostCard.fragments = gql`
  fragment PostCardPostData on Post {
    title
    thumbnails {
      thumbnailSquare {
        __typename
        altText
        id
        sourceUrl(size: MEDIUM_LARGE)
        slug
      }
    }
  }
`;

export default PostCard;
