import _get from 'lodash/get';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment } from 'react';
import PostLink from './PostLink';

function PostMediaBlock({ post }) {
  return (
    <div
      className="
        relative sm:flex mb-2 p-4 lg:px-0 lg:my-0 rounded overflow-hidden
        bg-white dark:bg-gray-900 lg:bg-transparent shadow lg:shadow-none"
      key={post.uri}>
      <PostLink className="absolute inset-0 sm:hidden" post={post} />
      {post.featuredImage && (
        <div
          className="
            w-24 h-24 sm:w-auto sm:h-auto ml-4 mb-3 sm:mr-6 sm:ml-0 sm:mb-0
            float-right shrink-0">
          <PostLink post={post}>
            <Image
              alt={post.featuredImage.node.altText}
              className="rounded"
              height={150}
              layout="intrinsic"
              loading="lazy"
              src={`https://res.cloudinary.com/vietnam-coracle/image/fetch/${post.featuredImage.node.srcMedium}`}
              width={150}
            />
          </PostLink>
        </div>
      )}
      <div className="flex-auto">
        <div className="flex items-baseline">
          <PostLink
            className="link sm:mt-1 text-base sm:text-2xl font-display"
            post={post}>
            {post.title}
          </PostLink>
        </div>
        <div
          className="my-1 text-sm sm:text-base lg:font-serif"
          dangerouslySetInnerHTML={{
            __html: post.excerpt || post.seo?.metaDesc,
          }}
        />
        {post.categories?.nodes.length > 0 && (
          <div className="hidden sm:block text-gray-500 dark:text-gray-400 lg:font-serif">
            Posted in{' '}
            {post.categories.nodes.map((cat, i) => (
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

export default PostMediaBlock;
