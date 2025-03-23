import _get from 'lodash/get';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { Fragment } from 'react';
import PostLink from './PostLink';

export type PostMediaBlockPost = {
  categories: {
    name: string;
    uri: string;
  }[];
  excerpt: string;
  image: {
    altText: string;
    src: string;
  };
  slug: string;
  title: string;
};

type Props = {
  navCategory?: string;
  post: PostMediaBlockPost;
};

function PostMediaBlock({ post, navCategory }: Props) {
  return (
    <div
      className="
        relative sm:flex mb-2 p-4 lg:px-0 lg:my-0 rounded overflow-hidden
        bg-white dark:bg-gray-900 lg:bg-transparent shadow lg:shadow-none"
      key={post.slug}>
      <PostLink
        className="absolute inset-0 sm:hidden"
        navCategory={navCategory}
        slug={post.slug}
      />
      {post.image && (
        <div
          className="
            w-24 h-24 sm:w-auto sm:h-auto ml-4 mb-3 sm:mr-6 sm:ml-0 sm:mb-0
            float-right shrink-0">
          <PostLink navCategory={navCategory} slug={post.slug}>
            <Image
              alt={post.image.altText}
              className="rounded"
              height={150}
              layout="intrinsic"
              loading="lazy"
              src={`https://res.cloudinary.com/vietnam-coracle/image/fetch/${post.image.src}`}
              width={150}
            />
          </PostLink>
        </div>
      )}
      <div className="flex-auto">
        <div className="flex items-baseline">
          <PostLink
            className="link sm:mt-1 text-base sm:text-2xl font-display"
            dangerouslySetInnerHTML={{
              __html: post.title,
            }}
            navCategory={navCategory}
            slug={post.slug}
          />
        </div>
        <div
          className="my-1 text-sm sm:text-base lg:font-serif"
          dangerouslySetInnerHTML={{
            __html: post.excerpt,
          }}
        />
        {post.categories?.length > 0 && (
          <div className="hidden sm:block text-gray-500 dark:text-gray-400 lg:font-serif">
            Posted in{' '}
            {post.categories.map((cat, i) => (
              <Fragment key={cat.uri}>
                {i !== 0 && ', '}
                <Link href={cat.uri} className="italic hover:underline">
                  {cat.name}
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
