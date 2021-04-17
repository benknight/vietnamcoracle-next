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
      <a className="group relative overflow-hidden flex flex-col shadow w-full rounded-lg bg-gray-900">
        <div
          className="relative block w-full bg-opacity-10 aspect-w-1 aspect-h-1"
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
          <div className="absolute inset-0 top-auto h-1/2 pointer-events-none bg-gradient-to-t from-gray-900 via-black-50 to-transparent" />
        </div>
        <div
          className={cx(
            'relative md:px-5 md:py-6',
            'flex-auto flex items-end',
            'md:text-white',
            'font-medium rounded-b',
            {
              '-mt-24 px-4 pt-4 pb-6': true,
            },
          )}>
          <div className="relative antialiased">
            <h3
              className={cx(
                'font-display text-white tracking-tightest sm:tracking-tight text-shadow',
                {
                  'text-2xl': flex,
                  'text-sm sm:text-base md:text-2xl':
                    !flex && post.title.length > 40,
                  'text-sm sm:text-lg md:text-2xl':
                    !flex && post.title.length <= 40,
                },
              )}>
              {post.title}
            </h3>
            <div
              className={cx(
                'post-card-excerpt',
                'mt-2 font-sans xl:font-serif text-xs lg:text-sm text-white',
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
