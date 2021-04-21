import cx from 'classnames';
import { gql } from 'graphql-request';
import _get from 'lodash/get';
import Image from 'next/image';
import Link from 'next/link';
import { createContext, useContext } from 'react';

interface Props {
  flex?: boolean;
  post: any;
}

export const SwatchesContext = createContext({});

const PostCard = ({ flex = false, post }: Props) => {
  if (!post.featuredImage) {
    return null;
  }
  const swatches = useContext(SwatchesContext);
  const swatch = swatches[post.featuredImage.node.id];
  return (
    <Link href={`/${post.slug}`}>
      <a className="group relative overflow-hidden flex flex-col shadow w-full rounded-lg sm:bg-gray-900">
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
          <div className="absolute inset-0 top-auto h-1/2 pointer-events-none sm:bg-gradient-to-t from-gray-900 via-black-50 to-transparent" />
        </div>
        <div
          className="
            relative sm:-mt-24 p-1 pt-2 sm:px-4 sm:pt-4 sm:pb-6 md:px-5 md:py-6
            flex-auto flex sm:items-end
            md:text-white
            font-medium rounded-b">
          <div className="relative">
            <h3
              className={cx(
                'text-xs sm:text-lg md:text-2xl font-sans sm:font-display text-gray-100 tracking-tightest lg:tracking-tight text-shadow',
                {
                  'text-2xl': flex,
                },
              )}>
              {post.title}
            </h3>
            <div
              className={cx(
                'post-card-excerpt',
                'mt-2 font-sans xl:font-serif text-xs md:text-sm text-gray-100',
                { 'hidden sm:block': !flex },
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
