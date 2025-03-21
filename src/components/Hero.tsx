import cx from 'classnames';
import Image from 'next/legacy/image';

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
  children?: React.ReactNode;
  className?: string;
  imgSm: HeroImage;
  imgLg: HeroImage;
  priority?: boolean;
  preserveAspectRatio?: boolean;
  theme?: 'light' | 'dark' | 'auto';
}

export default function Hero({
  children,
  className,
  imgSm,
  imgLg,
  preserveAspectRatio = false,
  priority = false,
  theme = 'auto',
}: Props) {
  return (
    <div
      className={cx(
        className,
        preserveAspectRatio
          ? 'bg-gray-400 dark:bg-gray-700'
          : {
              'bg-white dark:bg-gray-950': theme === 'auto',
              'bg-white': theme === 'light',
              'bg-gray-950': theme === 'dark',
            },
      )}>
      <div
        className={cx('relative block aspect-square md:hidden', {
          'md:aspect-[3/2]': !preserveAspectRatio,
        })}>
        <Image
          alt={imgSm.altText}
          key={imgSm.id}
          layout="fill"
          objectFit="cover"
          priority={priority}
          src={imgSm.sourceUrl}
        />
      </div>
      <div
        className={cx(
          'relative hidden md:block aspect-[1920/837] 2xl:aspect-[3/1]',
        )}>
        <Image
          className={cx('object-cover', {
            '2xl:object-contain': preserveAspectRatio,
          })}
          alt={imgLg.altText}
          key={imgLg.id}
          layout="fill"
          priority={priority}
          src={imgLg.sourceUrl}
        />
      </div>
      {children}
    </div>
  );
}

export function HeroContent({
  children,
  theme = 'auto',
}: {
  children: React.ReactNode;
  theme?: Props['theme'];
}) {
  return (
    <div
      className={cx('relative md:pb-1 dark:pb-0', {
        'text-gray-800 dark:text-white': theme === 'auto',
        'text-white': theme === 'dark',
        'text-gray-800': theme === 'light',
      })}>
      <div
        className={cx(
          'absolute bottom-full w-full h-52 md:h-48 xl:h-40',
          'bg-gradient-to-t to-transparent pointer-events-none',
          {
            'from-white via-white-25 dark:from-gray-950 dark:via-black-25':
              theme === 'auto',
            'from-gray-950 via-black-25': theme === 'dark',
            'from-white via-white-25': theme === 'light',
          },
        )}
      />
      <div className="relative pointer-events-auto">{children}</div>
    </div>
  );
}
