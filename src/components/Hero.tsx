import cx from 'classnames';
import Image from 'next/image';

type HeroImage = {
  sourceUrl: string;
  mediaDetails: {
    height: number;
    width: number;
  };
};

interface Props {
  children: JSX.Element;
  imgSm?: HeroImage;
  imgLg?: HeroImage;
}

export default function Hero({ children, imgSm, imgLg }: Props) {
  const showImg = imgSm && imgLg;
  return (
    <section className="mx-auto relative max-w-screen-2xl">
      {showImg && (
        <div className="bg-gray-400 dark:bg-gray-950">
          <div className="block lg:hidden">
            <Image
              alt=""
              height={imgSm.mediaDetails.height}
              src={imgSm.sourceUrl}
              width={imgSm.mediaDetails.width}
            />
          </div>
          <div className="hidden lg:block">
            <Image
              alt=""
              height={imgLg.mediaDetails.height}
              layout="responsive"
              src={imgLg.sourceUrl}
              width={imgLg.mediaDetails.width}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black-25 to-transparent"></div>
        </div>
      )}
      <div
        className={cx(
          'mx-auto pt-5 lg:pt-7 page-wrap flex items-end max-w-screen-2xl',
          {
            'absolute inset-0 text-gray-100 pb-5 lg:pb-7': showImg,
          },
        )}>
        {children}
      </div>
    </section>
  );
}
