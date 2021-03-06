import cx from 'classnames';
import { gql } from 'graphql-request';
import Image from 'next/image';

type HeroImage = {
  altText: string;
  id: string;
  sourceUrl: string;
  mediaDetails: {
    height: number;
    width: number;
  };
};

interface Props {
  children?: JSX.Element[] | JSX.Element;
  imgSm?: HeroImage;
  imgLg?: HeroImage;
}

export default function Hero({ children, imgSm, imgLg }: Props) {
  const showImg = imgSm && imgLg;
  const hasChildren = Boolean(children);
  return (
    <section
      className={cx('relative mx-auto max-w-screen-2xl bg-gray-950', {
        'pb-12': hasChildren,
      })}>
      {showImg && (
        <div className="bg-gray-400">
          <div className="cover-img flex md:hidden">
            <Image
              alt={imgSm.altText}
              height={imgSm.mediaDetails.height}
              key={imgSm.id}
              src={imgSm.sourceUrl}
              width={imgSm.mediaDetails.width}
            />
          </div>
          <div className="cover-img hidden md:block">
            <Image
              alt={imgLg.altText}
              height={imgLg.mediaDetails.height}
              key={imgLg.id}
              layout="responsive"
              objectFit="cover"
              src={imgLg.sourceUrl}
              width={imgLg.mediaDetails.width}
            />
          </div>
          {hasChildren && (
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-black-25 to-transparent mb-12"></div>
          )}
        </div>
      )}
      <div
        className={cx(
          'mx-auto pt-5 lg:pt-7 page-wrap flex items-end max-w-screen-2xl',
          {
            'absolute inset-0 text-gray-100 pb-4 lg:pb-5 dark:pb-2 lg:dark:pb-2': showImg,
          },
        )}>
        {children}
      </div>
    </section>
  );
}

Hero.fragments = gql`
  fragment HeroImageData on MediaItem {
    altText
    id
    sourceUrl
    mediaDetails {
      height
      width
    }
  }
`;
