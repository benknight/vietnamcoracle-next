import cx from 'classnames';
import _debounce from 'lodash/debounce';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRef, useState, useEffect, Children } from 'react';
import Headroom from 'react-headroom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import breakpoints from '../config/breakpoints';
import SearchForm from './SearchForm';
import ElsewhereLinks from './ElsewhereLinks';

interface Props {
  preview?: boolean;
}

export default function Header({ preview = false }: Props) {
  const ref = useRef<HTMLElement>();
  const [scrolled, setScolled] = useState(false);
  const [pastThreshold, setPastThreshold] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const router = useRouter();
  const isLG = useMediaQuery(`(min-width: ${breakpoints.lg})`);
  const isHome = router.asPath === '/' || router.asPath === '/browse';
  const showMini = !isHome || pastThreshold;

  useEffect(() => {
    const update = _debounce(() => {
      const { matches: isLarge } = window.matchMedia(
        `(min-width: ${breakpoints.lg})`,
      );
      const thresholdHeight =
        (isLarge ? 1 : 0.75) * ref.current.getBoundingClientRect().height;
      setScolled(window.scrollY > 0);
      setPastThreshold(window.scrollY >= thresholdHeight);
    }, 10);

    // Call update on initialization
    update();

    // Subscribe to events
    router.events.on('routeChangeComplete', update);
    window.addEventListener('scroll', update);

    return () => {
      router.events.off('routeChangeComplete', update);
      window.removeEventListener('scroll', update);
    };
  }, []);

  return (
    <>
      <Headroom className="relative lg:fixed z-30 w-full" disable={isLG}>
        <div
          className={cx('h-14 lg:h-auto bg-white dark:bg-gray-900', {
            shadow: scrolled,
            'top-0': !preview,
            'top-8': preview,
          })}>
          <div
            className={cx(
              'z-20 absolute top-0 left-0 overflow-hidden',
              'flex items-center h-14 xl:h-16 px-2 xl:px-4',
              'transform transition-transform duration-200 ease-out',
              {
                '-translate-x-14 xl:-translate-x-16': !showMini,
              },
            )}>
            <Link href="/" shallow={router.pathname === '/[[...slug]]'}>
              <a className="flex items-center hover:text-black dark:hover:text-white">
                <Image
                  className="rounded-full transform scale-90 xl:scale-100"
                  height={44}
                  loading="eager"
                  src="/logo.jpg"
                  width={44}
                />
                <h1
                  className={cx(
                    'ml-2 font-semibold font-display tracking-tight',
                    {
                      hidden: !showMini,
                    },
                  )}>
                  Vietnam Coracle
                </h1>
              </a>
            </Link>
          </div>
          <div
            className={cx(
              'z-30 absolute top-0 right-0',
              {
                'left-auto': !searchFocused && showMini,
                'left-0 lg:left-auto': searchFocused || !showMini,
              },
              'flex items-center h-14 xl:h-16 px-2 xl:px-4 text-gray-400',
            )}>
            <SearchForm
              className={cx({
                hidden: router.pathname === '/search',
                'w-32 md:w-44': !searchFocused,
                'w-full md:w-60': searchFocused,
              })}
              onBlur={() => setSearchFocused(false)}
              onFocus={() => setSearchFocused(true)}
            />
          </div>
        </div>
      </Headroom>
      <header
        className={cx(
          'relative py-12 sm:py-16 px-3 xl:py-16 text-center',
          'bg-white dark:bg-gray-900 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-950',
          { 'mt-8': preview },
          { hidden: !isHome },
        )}
        ref={ref}>
        <div className="hidden lg:block absolute top-4 left-4 opacity-75">
          <ElsewhereLinks useBrandColors />
        </div>
        <Link href="/">
          <a className="inline-flex flex-col items-center">
            <Image
              className="rounded-full"
              height={120}
              loading="eager"
              src="/logo.jpg"
              width={120}
            />
            <h1 className="my-2 text-3xl xl:text-4xl text-gray-700 dark:text-white font-display antialiased">
              Vietnam Coracle
            </h1>
            <h2 className="text-xxxxs xl:text-xxxs text-gray-600 dark:text-gray-500 uppercase tracking-widest font-display">
              Independent travel guides to Vietnam
            </h2>
          </a>
        </Link>
      </header>
    </>
  );
}
