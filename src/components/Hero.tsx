import cx from 'classnames';
import { gql } from 'graphql-request';
import Image from 'next/image';
import { createContext, useContext } from 'react';

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
  theme: 'light' | 'dark' | 'auto';
}

const HeroContext = createContext({
  theme: 'auto',
});

export default function Hero({
  children,
  imgSm,
  imgLg,
  theme = 'auto',
}: Props) {
  return (
    <HeroContext.Provider value={{ theme }}>
      <div
        className={cx({
          'bg-white dark:bg-gray-950': theme === 'auto',
          'bg-white': theme === 'light',
          'bg-gray-950': theme === 'dark',
        })}>
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
    </HeroContext.Provider>
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
  const { theme } = useContext(HeroContext);
  return (
    <div
      className={cx('relative pb-4', {
        'text-gray-900 dark:text-white': theme === 'auto',
        'text-white': theme === 'dark',
        'text-gray-900': theme === 'light',
      })}>
      <div
        className={cx(
          'absolute bottom-full w-full -mb-16 sm:-mb-12 lg:-mb-7',
          'h-52 md:h-48 xl:h-32',
          'bg-gradient-to-t via-black-25 to-transparent',
          'pointer-events-none',
          {
            'from-white dark:from-gray-950': theme === 'auto',
            'from-gray-950': theme === 'dark',
            'from-white': theme === 'light',
          },
        )}
      />
      <div className="relative -mt-16 sm:-mt-12 lg:-mt-7 pointer-events-auto">
        {children}
      </div>
    </div>
  );
}
