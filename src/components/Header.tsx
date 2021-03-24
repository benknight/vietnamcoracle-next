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
  const [aboveThreshold, setAboveThreshold] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const router = useRouter();
  const isXL = useMediaQuery(`(min-width: ${breakpoints.xl})`);
  const isHome = router.asPath === '/' || router.asPath === '/browse';
  const showMini = !isHome || aboveThreshold;

  useEffect(() => {
    const update = _debounce(() => {
      const { matches: isLarge } = window.matchMedia(
        `(min-width: ${breakpoints.lg})`,
      );
      const thresholdHeight =
        (isLarge ? 1 : 0.75) * ref.current.getBoundingClientRect().height;
      setScolled(window.scrollY > 0);
      setAboveThreshold(window.scrollY >= thresholdHeight);
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
      <Headroom className="relative xl:fixed z-30 w-full" disable={isXL}>
        <div
          className={cx('h-14 xl:h-auto bg-white dark:bg-gray-900', {
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
              <a className="flex items-center">
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
              'z-30 absolute top-0 right-0 flex items-center h-14 xl:h-16 px-2 xl:px-4 text-gray-400',
              {
                'left-auto': !searchFocused && showMini,
                'left-0 xl:left-auto': searchFocused || !showMini,
              },
            )}>
            <SearchForm
              className={cx({
                hidden: router.pathname === '/search',
                'w-32 lg:w-44': !searchFocused,
                'w-full lg:w-60': searchFocused,
              })}
              onBlur={() => setSearchFocused(false)}
              onFocus={() => setSearchFocused(true)}
            />
          </div>
        </div>
      </Headroom>
      <header
        className={cx(
          'relative py-12 sm:py-16 px-3 xl:py-16 text-center bg-white dark:bg-gray-900 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-950',
          { 'mt-8': preview },
          { hidden: !isHome },
        )}
        ref={ref}>
        <div className="hidden xl:block absolute top-4 left-4 opacity-75">
          <ElsewhereLinks />
        </div>
        <Link href="/" shallow={router.pathname === '/[[...slug]]'}>
          <a className="inline-flex flex-col items-center">
            <Image
              className="rounded-full"
              height={120}
              loading="eager"
              src="/logo.jpg"
              width={120}
            />
            <h1 className="text-3xl xl:text-4xl my-2 text-gray-700 dark:text-white font-display antialiased">
              Vietnam Coracle
            </h1>
            <h2 className="text-gray-600 dark:text-gray-500 uppercase tracking-widest font-display text-xxxxs">
              Independent travel guides to Vietnam
            </h2>
          </a>
        </Link>
      </header>
    </>
  );
}
