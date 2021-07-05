import cx from 'classnames';
import { gql } from 'graphql-request';
import _get from 'lodash/get';
import Image from 'next/image';
import Link from 'next/link';
import { createContext, useContext } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import breakpoints from '../config/breakpoints';

interface Props {
  inGrid?: boolean;
  post: any;
}

const SwatchesContext = createContext({});
export const SwatchesProvider = SwatchesContext.Provider;

const PostCard = ({ inGrid = false, post }: Props) => {
  const swatches = useContext(SwatchesContext);
  const isSmall = useMediaQuery(`(min-width: ${breakpoints.sm})`);
  if (!post.featuredImage) {
    return null;
  }
  const swatch = swatches[post.featuredImage.node.id];
  return (
    <Link href={`/${post.slug}`}>
      <a
        className={cx(
          'group relative overflow-hidden flex flex-col sm:shadow w-full rounded-lg',
          { 'bg-gray-900': isSmall || inGrid },
        )}>
        <div
          className="
            relative overflow-hidden block w-full
            bg-opacity-10 aspect-w-1 aspect-h-1
            rounded-b-lg sm:rounded-none"
          style={{
            backgroundColor: swatch,
          }}>
          <Image
            alt={post.featuredImage.node.altText}
            layout="fill"
            loading="lazy"
            objectFit="cover"
            src={`https://res.cloudinary.com/vietnam-coracle/image/fetch/${post.featuredImage.node.sourceUrl}`}
          />
          <div
            className={cx(
              'absolute inset-0 top-auto h-1/2 pointer-events-none ',
              {
                'bg-gradient-to-t from-gray-900 via-black-50 to-transparent':
                  isSmall || inGrid,
              },
            )}
          />
        </div>
        <div
          className={cx(
            'relative flex-auto flex p-1 pt-2 md:px-5 md:py-6 font-medium',
            {
              'items-end -mt-24 px-4 pt-4 pb-6 rounded-b': inGrid || isSmall,
            },
          )}>
          <div className="relative">
            <h3
              className={cx(
                'text-sm md:text-2xl tracking-tightest lg:tracking-tight',
                {
                  'sm:text-lg sm:leading-snug': !inGrid,
                  'font-display text-2xl text-gray-100': inGrid || isSmall,
                },
              )}>
              {post.title}
            </h3>
            <div
              className={cx(
                'post-card-excerpt',
                'mt-2 font-sans text-sm text-gray-100 xl:text-gray-300',
                {
                  'hidden sm:block sm:line-clamp-3 xl:line-clamp-none': !inGrid,
                },
              )}
              dangerouslySetInnerHTML={{ __html: post.excerpt }}></div>
          </div>
        </div>
      </a>
    </Link>
  );
};

PostCard.fragments = gql`
  fragment PostCardPostData on Post {
    excerpt
    slug
    title
    featuredImage {
      node {
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

export default PostCard;
