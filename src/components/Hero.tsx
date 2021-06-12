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
  imgSm: HeroImage;
  imgLg: HeroImage;
}

export default function Hero({ children, imgSm, imgLg }: Props) {
  return (
    <div className="bg-gray-950">
      <div className="cover-img flex lg:hidden">
        <Image
          alt={imgSm.altText}
          height={imgSm.mediaDetails.height}
          key={imgSm.id}
          src={imgSm.sourceUrl}
          width={imgSm.mediaDetails.width}
        />
      </div>
      <div className="cover-img hidden lg:block">
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
      {children}
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

export function HeroContent({ children }) {
  return (
    <div className="relative text-gray-100 pb-4">
      <div
        className={cx(
          'absolute bottom-full w-full -mb-16 sm:-mb-12',
          'h-52 md:h-48',
          'bg-gradient-to-t from-gray-950 via-black-25 to-transparent',
          'pointer-events-none',
        )}
      />
      <div className="text-white relative -mt-16 sm:-mt-12 pointer-events-auto">
        {children}
      </div>
    </div>
  );
}
