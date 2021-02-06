import cx from 'classnames';
import { gql } from 'graphql-request';
import _get from 'lodash/get';
import Image from 'next/image';
import Link from 'next/link';
// import useMediaQuery from '@material-ui/core/useMediaQuery';
import swatches from '../json/swatches.json';

const swatchKey = 'DarkMuted';

interface Props {
  flex?: boolean;
  post: any;
}

function PostCard({ flex = false, post }: Props) {
  // const isDark = useMediaQuery('(prefers-color-scheme: dark)');
  // TODO: Swatches need to be generated on build
  if (!post.featuredImage) {
    return null;
  }
  const swatch = _get(swatches, [post.featuredImage.node.id, swatchKey], {});
  return (
    <Link href={`/${post.slug}`}>
      <a className="relative overflow-hidden flex flex-col md:shadow lg:shadow rounded-lg w-full">
        <div
          className={cx(
            'relative block w-full bg-opacity-10',
            'aspect-w-1 aspect-h-1',
            'md:aspect-w-4 md:aspect-h-3 lg:aspect-w-4 lg:aspect-h-3',
            'overflow-hidden rounded-xl md:rounded-none lg:rounded-none',
          )}
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
          className={cx(
            'relative md:px-4 md:py-5 lg:px-4 lg:py-5',
            'flex-auto flex items-start',
            'md:text-white lg:text-white md:bg-gray-900 lg:bg-gray-900',
            'font-medium rounded-b',
            {
              'px-1 pt-4 pb-6': flex,
              'p-1 pt-2 pr-2': !flex,
            },
          )}>
          <div className="hidden md:block lg:block">
            <Image
              alt=""
              className="object-bottom object-cover opacity-50"
              layout="fill"
              loading="eager"
              src={`https://res.cloudinary.com/vietnam-coracle/image/fetch/a_vflip,c_fill,e_blur:2000,g_north,h_75,w_150/${post.featuredImage.node.sourceUrlFx}`}
              unoptimized
            />
          </div>
          <div className="relative font-serif antialiased">
            <h3
              className={cx('leading-tight md:text-xl lg:text-2xl', {
                'text-2xl': flex,
                'text-sm sm:text-base': !flex && post.title.length > 40,
                'text-sm sm:text-lg': !flex && post.title.length <= 40,
              })}>
              {post.title}
            </h3>
            <div
              className={cx(
                'post-card-excerpt mt-2 text-sm md:text-xs lg:text-sm opacity-75',
                { 'hidden md:line-clamp lg:line-clamp': !flex },
              )}
              dangerouslySetInnerHTML={{ __html: post.excerpt }}></div>
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

export default PostCard;
