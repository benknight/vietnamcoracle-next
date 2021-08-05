import cx from 'classnames';
import { gql } from 'graphql-request';
import _get from 'lodash/get';
import Image from 'next/image';
import { createContext, useContext } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import breakpoints from '../config/breakpoints';
import PostLink from './PostLink';

interface Props {
  inGrid?: boolean;
  data: any;
}

const SwatchesContext = createContext({});
export const SwatchesProvider = SwatchesContext.Provider;

const PostCard = ({ inGrid = false, data }: Props) => {
  const swatches = useContext(SwatchesContext);
  const isSmall = useMediaQuery(`(min-width: ${breakpoints.sm})`);
  if (!data.featuredImage) {
    return null;
  }
  const swatch = swatches[data.featuredImage.node.id];
  return (
    <PostLink post={data}>
      <a
        className={cx(
          'postcard group relative overflow-hidden flex flex-col sm:shadow w-full rounded-lg',
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
            alt={data.featuredImage.node.altText}
            className="transition-transform ease-out duration-300 pointer:transform origin-top group-hover:scale-[1.02] group-hover:duration-[3s]"
            layout="fill"
            loading="lazy"
            objectFit="cover"
            src={`https://res.cloudinary.com/vietnam-coracle/image/fetch/${data.featuredImage.node.srcLg}`}
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
                'font-display text-xs md:text-2xl tracking-tightest lg:tracking-tight group-hover:underline',
                {
                  'sm:text-lg sm:leading-snug': !inGrid,
                  'text-2xl text-gray-100': inGrid || isSmall,
                },
              )}>
              {data.title}
            </h3>
            <div
              className={cx(
                'postcard-excerpt',
                'mt-2 font-serif text-sm text-gray-100 xl:text-gray-300',
                {
                  'hidden sm:block sm:line-clamp-3 xl:line-clamp-none': !inGrid,
                },
              )}
              dangerouslySetInnerHTML={{ __html: data.excerpt }}></div>
          </div>
        </div>
      </a>
    </PostLink>
  );
};

PostCard.fragments = gql`
  fragment PostCardData on ContentNode {
    uri
    slug
    ... on NodeWithExcerpt {
      excerpt
    }
    ... on NodeWithFeaturedImage {
      featuredImage {
        node {
          __typename
          altText
          id
          srcLg: sourceUrl(size: LARGE)
          srcFx: sourceUrl(size: MEDIUM)
          slug
        }
      }
    }
    ... on NodeWithTitle {
      title
    }
  }
`;

export default PostCard;
