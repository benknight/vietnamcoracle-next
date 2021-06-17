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
    <div className="bg-white dark:bg-gray-950">
      <div className="block aspect-w-1 aspect-h-1 md:aspect-w-3 md:aspect-h-2 lg:hidden">
        <Image
          alt={imgSm.altText}
          key={imgSm.id}
          layout="fill"
          objectFit="cover"
          src={imgSm.sourceUrl}
        />
      </div>
      <div className="hidden lg:block">
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
    <div className="relative pb-4">
      <div
        className={cx(
          'absolute bottom-full w-full -mb-16 sm:-mb-12 lg:-mb-6',
          'h-52 md:h-48 lg:h-32',
          'bg-gradient-to-t to-transparent',
          'from-white dark:from-gray-950 via-black-25',
          'pointer-events-none',
        )}
      />
      <div className="relative -mt-16 sm:-mt-12 lg:-mt-6 pointer-events-auto">
        {children}
      </div>
    </div>
  );
}
