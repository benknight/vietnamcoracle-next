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
  return (
    <section className="relative mx-auto max-w-screen-2xl bg-white">
      {showImg && (
        <div className="bg-gray-400">
          <div className="cover-img flex md:hidden lg:hidden">
            <Image
              alt={imgSm.altText}
              height={imgSm.mediaDetails.height}
              key={imgSm.id}
              src={imgSm.sourceUrl}
              width={imgSm.mediaDetails.width}
            />
          </div>
          <div className="cover-img hidden md:block lg:block">
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
          {Boolean(children) && (
            <div className="absolute inset-0 bg-gradient-to-t from-near-black via-black-25 to-transparent"></div>
          )}
        </div>
      )}
      <div
        className={cx(
          'mx-auto pt-5 lg:pt-7 page-wrap flex items-end max-w-screen-2xl',
          {
            'absolute inset-0 text-gray-100 pb-4 lg:pb-5': showImg,
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
