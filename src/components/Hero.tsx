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
  className?: string;
  imgSm: HeroImage;
  imgLg: HeroImage;
  preserveAspectRatio?: boolean;
  theme?: 'light' | 'dark' | 'auto';
}

const HeroContext = createContext({
  theme: 'auto',
});

export default function Hero({
  children,
  className,
  imgSm,
  imgLg,
  preserveAspectRatio = false,
  theme = 'auto',
}: Props) {
  return (
    <HeroContext.Provider value={{ theme }}>
      <div
        className={cx(className, {
          'bg-white dark:bg-gray-950': theme === 'auto',
          'bg-white': theme === 'light',
          'bg-gray-950': theme === 'dark',
        })}>
        <div
          className={cx('block aspect-w-1 aspect-h-1 lg:hidden', {
            'md:aspect-w-3 md:aspect-h-2': !preserveAspectRatio,
          })}>
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
        'text-gray-800 dark:text-white': theme === 'auto',
        'text-white': theme === 'dark',
        'text-gray-800': theme === 'light',
      })}>
      <div
        className={cx(
          'absolute bottom-full w-full h-52 md:h-48 xl:h-32',
          'bg-gradient-to-t to-transparent from-gray-950 via-black-25 pointer-events-none',
          {
            'opacity-50 dark:opacity-100': theme === 'auto',
            'opacity-100': theme === 'dark',
            'opacity-50': theme === 'light',
          },
        )}
      />
      <div className="relative pointer-events-auto">{children}</div>
    </div>
  );
}
