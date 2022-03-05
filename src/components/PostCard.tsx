import cx from 'classnames';
import _get from 'lodash/get';
import Image from 'next/image';
import { useMemo } from 'react';
import PostLink from './PostLink';

interface Props {
  ad?: any;
  inGrid?: boolean;
  post?: any;
}

const PostCard = ({ ad, inGrid = false, post }: Props) => {
  const data = useMemo(
    () =>
      ad
        ? {
            body: ad.body,
            image: ad.image,
            title: ad.heading,
          }
        : post
        ? {
            body: post.excerpt,
            image: post.featuredImage.node,
            title: post.title,
          }
        : null,
    [post, ad],
  );

  // Render nothing if there is no image
  if (!data.image) return null;

  const inner = (
    <>
      <div className="relative overflow-hidden block w-full aspect-w-1 aspect-h-1">
        <Image
          alt={data.image.altText}
          className="transition-ease-out duration-300 pointer:origin-top group-hover:scale-[1.02] group-hover:duration-[3s]"
          layout="fill"
          loading="lazy"
          objectFit="cover"
          src={`https://res.cloudinary.com/vietnam-coracle/image/fetch/${data.image.srcLarge}`}
        />
        <div className="absolute inset-0 top-auto h-1/2 pointer-events-none bg-gradient-to-t from-gray-900 via-black-50 to-transparent" />
      </div>
      <div className="relative flex-auto flex items-end -mt-32 p-1 px-4 md:px-5 md:py-6 pt-4 pb-6 font-medium rounded-b">
        <div className="relative">
          {ad && (
            <div className="inline-block text-xs bg-yellow-400 text-yellow-900 p-1 rounded-sm leading-none mb-2">
              Sponsored
            </div>
          )}
          <h3
            className={cx(
              'font-display text-2xl text-gray-100 tracking-tightest lg:tracking-tight',
              {
                'text-lg md:text-2xl leading-snug': !inGrid,
              },
            )}>
            {data.title}
          </h3>
          <div
            className={cx(
              'postcard-excerpt',
              'mt-2 font-serif text-sm text-gray-100 xl:text-gray-300',
              {
                'block line-clamp-3 xl:line-clamp-4': !inGrid,
              },
            )}
            dangerouslySetInnerHTML={{ __html: data.body }}></div>
          {ad && (
            <div className="rounded mt-3 p-2 bg-blue-700 text-white text-center">
              {ad.cta.title}
            </div>
          )}
        </div>
      </div>
    </>
  );

  const parentClassName =
    'postcard group relative overflow-hidden flex flex-col bg-gray-900 shadow w-full rounded-lg';

  if (ad) {
    return (
      <a className={parentClassName} href={ad.cta.url} target="_blank">
        {inner}
      </a>
    );
  }

  return (
    <PostLink className={parentClassName} post={post}>
      {inner}
    </PostLink>
  );
};

export default PostCard;
