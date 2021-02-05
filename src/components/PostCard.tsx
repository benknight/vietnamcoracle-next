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
    featuredImage {
      node {
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
  const swatch = _get(swatches, [post.featuredImage.node.id, swatchKey], {});
  return (
    <Link href={`/${post.slug}`}>
      <a className="relative overflow-hidden flex flex-col shadow rounded-lg">
        <div
          className={cx(
            'relative block w-full md:h-60 lg:h-60 xl:h-72 bg-opacity-10',
            {
              'h-52': flex,
              'h-32 sm:h-40': !flex,
            },
          )}
          // onClick={event => event.preventDefault()}
          style={{
            backgroundColor: swatch.hex,
          }}>
          <Image
            alt={post.featuredImage.node.altText}
            layout="fill"
            loading="lazy"
            objectFit="cover"
            src={`https://res.cloudinary.com/vietnam-coracle/image/fetch/${post.featuredImage.node.sourceUrl}`}
          />
        </div>
        <div
          className="
            relative p-3 md:px-4 md:py-5 lg:px-4 lg:py-5
            flex-auto flex items-center md:items-start lg:items-start
            text-white bg-gray-900
            font-medium rounded-b">
          <Image
            alt=""
            className="object-bottom object-cover opacity-50"
            layout="fill"
            loading="eager"
            src={`https://res.cloudinary.com/vietnam-coracle/image/fetch/a_vflip,c_fill,e_blur:2000,g_north,h_75,w_150/${post.featuredImage.node.sourceUrlFx}`}
            unoptimized
          />
          <div className="relative font-serif antialiased">
            <h3
              className={cx('leading-tight md:text-xl lg:text-2xl', {
                'text-xl': flex,
                'text-sm': !flex && post.title.length > 40,
                'text-sm sm:text-base': !flex && post.title.length <= 40,
              })}>
              {post.title}
            </h3>
            <div
              className={cx(
                'post-card-excerpt mt-2 text-xs sm:text-sm md:text-xs lg:text-sm opacity-75',
                { 'hidden md:line-clamp lg:line-clamp': !flex },
              )}
              dangerouslySetInnerHTML={{ __html: post.excerpt }}></div>
          </div>
        </div>
      </a>
    </Link>
  );
}

PostCard.fragments = fragments;

export default PostCard;
