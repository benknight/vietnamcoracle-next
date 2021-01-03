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
  flex?: boolean;
  post: any;
}

function PostCard({ flex = false, post }: Props) {
  // const isDark = useMediaQuery('(prefers-color-scheme: dark)');
  // TODO: Swatches need to be generated on build
  const swatchKey = 'DarkMuted';
  const swatch = _get(
    swatches,
    [post.thumbnails.thumbnailSquare.id, swatchKey],
    {},
  );
  return (
    <Link href={`/posts/${post.slug}`}>
      <a
        className={cx(
          'relative overflow-hidden flex flex-col shadow rounded-lg',
          {
            'w-44 md:w-96': !flex,
          },
        )}>
        <div
          className="relative block w-full h-40 md:h-72 bg-opacity-10"
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
          className="
            relative p-3 md:px-4 md:py-5 md:h-48
            flex-auto flex items-center md:items-start
            text-white bg-gray-900
            font-medium rounded-b">
          <Image
            alt=""
            className="object-bottom object-cover opacity-50"
            layout="fill"
            loading="eager"
            src={`https://res.cloudinary.com/vietnam-coracle/image/fetch/a_vflip,c_fill,e_blur:2000,g_north,h_75,w_150/${post.thumbnails.thumbnailSquare.sourceUrlFx}`}
            unoptimized
          />
          <div className="relative font-serif antialiased">
            <h3
              className={cx('leading-tight md:text-xl lg:text-2xl', {
                'text-sm': post.title.length > 40,
                'text-base': post.title.length <= 40,
              })}>
              {post.title}
            </h3>
            <div
              className="post-card-excerpt mt-2 text-xs sm:text-sm md:text-xs lg:text-sm opacity-75"
              dangerouslySetInnerHTML={{ __html: post.excerpt }}
            />
          </div>
        </div>
      </a>
    </Link>
  );
}

PostCard.fragments = fragments;

export default PostCard;
