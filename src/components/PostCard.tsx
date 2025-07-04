import cx from 'classnames';
import _get from 'lodash/get';
import Image from 'next/legacy/image';
import { useMemo } from 'react';
import PostLink from './PostLink';

interface Props {
  ad?: any;
  inGrid?: boolean;
  navCategory?: string;
  post?: any;
  showAdTag?: boolean;
}

const PostCard = ({
  ad,
  inGrid = false,
  navCategory,
  post,
  showAdTag = false,
}: Props) => {
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
            image: post.featuredImage?.node,
            title: post.title,
          }
        : {},
    [post, ad],
  );

  // Render nothing if there is no image
  if (!data.image) return null;

  const inner = (
    <>
      <div className="relative overflow-hidden w-full aspect-square">
        <Image
          alt={data.image.altText}
          className="ease-out duration-1000 pointer:origin-top group-hover:xl:scale-[1.02] group-hover:duration-[3s] group-hover:ease bg-gray-400 dark:bg-gray-700"
          layout="fill"
          loading="lazy"
          objectFit="cover"
          src={data.image.srcLarge}
        />
      </div>
      <div className="absolute w-full pt-[101%] pointer-events-none">
        <div className="absolute inset-0 top-auto h-1/2 bg-gradient-to-t from-gray-900 via-black-50" />
      </div>
      <div
        className={cx(
          'relative flex-auto flex items-end p-1 px-4 md:px-5 py-4 xl:pb-5 font-medium rounded-b -mt-24',
        )}>
        <div className="relative w-full">
          {showAdTag && (
            <div className="inline-block text-xs bg-yellow-300 text-yellow-700 p-1 rounded-sm leading-none mb-2 shadow-sm">
              Advertisement
            </div>
          )}
          {data.title.trim() && (
            <h3
              className={cx(
                'font-display text-gray-100 tracking-tightest lg:tracking-tight',
                {
                  'text-lg lg:text-xl leading-snug': !inGrid,
                  'text-2xl': inGrid,
                },
              )}>
              {data.title}
            </h3>
          )}
          {data.body.trim() && (
            <div className="postcard-excerpt leading-snug mt-2 font-serif text-sm 2xl:text-base text-white/60 block !line-clamp-3">
              <div dangerouslySetInnerHTML={{ __html: data.body }} />
              {/* <div className="link whitespace-nowrap text-blue-300">
              Read more ›
            </div> */}
            </div>
          )}
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
    'postcard group relative overflow-hidden flex flex-col bg-gradient-to-b from-transparent via-gray-900 to-gray-900 shadow w-full rounded-lg dark:border dark:border-gray-700';

  if (ad) {
    const trackingCode =
      ad.code?.match(
        /data-track=(?:(['"])(?<trackingCode>[\s\S]*?)\1|([^\s>]+))/,
      )?.groups.trackingCode ?? undefined;

    const isExternalLink = ad.cta.url.indexOf('vietnamcoracle.com') === -1;

    return (
      <a
        className={cx(parentClassName, trackingCode ? 'gofollow' : '')}
        href={ad.cta.url}
        target={isExternalLink ? '_blank' : undefined}
        rel={isExternalLink ? 'sponsored noopener' : undefined}
        data-track={trackingCode}>
        {inner}
      </a>
    );
  }

  return (
    <PostLink
      className={parentClassName}
      navCategory={navCategory}
      slug={post.slug}>
      {inner}
    </PostLink>
  );
};

export default PostCard;
