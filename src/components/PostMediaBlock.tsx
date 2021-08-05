import { gql } from 'graphql-request';
import _get from 'lodash/get';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment } from 'react';
import PostLink from './PostLink';

function PostMediaBlock({ data }) {
  return (
    <div
      className="
        relative sm:flex mb-2 p-4 lg:px-0 lg:my-0 rounded overflow-hidden
        bg-white dark:bg-gray-900 lg:bg-transparent shadow lg:shadow-none"
      key={data.uri}>
      <PostLink post={data}>
        <a className="absolute inset-0 sm:hidden" />
      </PostLink>
      {data.featuredImage && (
        <div
          className="
            w-24 h-24 sm:w-auto sm:h-auto ml-4 mb-3 sm:mr-6 sm:ml-0 sm:mb-0
            float-right flex-shrink-0">
          <PostLink post={data}>
            <a>
              <Image
                alt={data.featuredImage.node.altText}
                className="rounded"
                height={150}
                layout="intrinsic"
                loading="lazy"
                src={`https://res.cloudinary.com/vietnam-coracle/image/fetch/${data.featuredImage.node.srcMd}`}
                width={150}
              />
            </a>
          </PostLink>
        </div>
      )}
      <div className="flex-auto">
        <div className="flex items-baseline">
          <PostLink post={data}>
            <a className="link sm:mt-1 text-base sm:text-2xl font-display">
              {data.title}
            </a>
          </PostLink>
        </div>
        <div
          className="my-1 text-sm sm:text-base lg:font-serif"
          dangerouslySetInnerHTML={{
            __html: data.excerpt || data.seo?.metaDesc,
          }}
        />
        {data.categories?.nodes.length > 0 && (
          <div className="hidden sm:block text-gray-500 dark:text-gray-400 lg:font-serif">
            Posted in{' '}
            {data.categories.nodes.map((cat, i) => (
              <Fragment key={cat.uri}>
                {i !== 0 && ', '}
                <Link href={cat.uri}>
                  <a className="italic hover:underline">{cat.name}</a>
                </Link>
              </Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

PostMediaBlock.fragments = gql`
  fragment PostMediaBlockData on ContentNode {
    slug
    uri
    ... on NodeWithExcerpt {
      excerpt
    }
    ... on NodeWithFeaturedImage {
      featuredImage {
        node {
          altText
          srcMd: sourceUrl(size: MEDIUM)
          slug
        }
      }
    }
    ... on NodeWithTitle {
      title
    }
    ... on Page {
      seo {
        metaDesc
      }
    }
    ... on Post {
      categories(where: { exclude: 154 }) {
        nodes {
          name
          uri
        }
      }
    }
  }
`;

export default PostMediaBlock;
