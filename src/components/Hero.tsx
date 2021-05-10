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
    <div className="bg-gray-900">
      <section
        className={cx('relative', {
          'bg-gray-950': showImg,
          'bg-white dark:bg-gray-950': !showImg,
          'pb-4': showImg && hasChildren,
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
              <div className="absolute left-0 bottom-0 right-0 h-80 md:h-48 lg:h-60 bg-gradient-to-t from-gray-950 via-black-25 to-transparent mb-4 pointer-events-none"></div>
            )}
          </div>
        )}
        <div
          className={cx('mx-auto pt-5 lg:pt-7 flex items-end', {
            'absolute inset-0 text-gray-100 pb-4 lg:pb-5 pointer-events-none': showImg,
          })}>
          <div className="flex-auto pointer-events-auto">{children}</div>
        </div>
      </section>
    </div>
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
