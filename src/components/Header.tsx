import cx from 'classnames';
import _debounce from 'lodash/debounce';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRef, useState, useEffect, Children } from 'react';
import Headroom from 'react-headroom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import MenuIcon from '@material-ui/icons/Menu';
import SearchForm from './SearchForm';

interface Props {
  preview?: boolean;
}

function ConditionalHeadroom({ children }) {
  const isSmall = useMediaQuery('(max-width: 1024px)');
  if (typeof window !== 'undefined' && isSmall) {
    return <Headroom>{children}</Headroom>;
  }
  return children;
}

export default function Header({ preview = false }: Props) {
  const ref = useRef<HTMLElement>();
  const [scrolled, setScolled] = useState(false);
  const [showMini, setShowMini] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const listener = _debounce(() => {
      // NOTE: To avoid complexity the following breakpoint value is hardcoded
      // https://tailwindcss.com/docs/configuration#referencing-in-java-script
      const { matches: isLarge } = window.matchMedia('(min-width: 1024px)');
      const thresholdHeight =
        (isLarge ? 1 : 0.75) * ref.current.getBoundingClientRect().height;
      setScolled(window.scrollY > 0);
      setShowMini(window.scrollY >= thresholdHeight);
    }, 10);
    listener();
    window.addEventListener('scroll', listener);
    return () => window.removeEventListener('scroll', listener);
  }, []);

  return (
    <>
      <ConditionalHeadroom>
        <div
          className={cx(
            'w-full h-14 lg:h-auto lg:fixed z-30 bg-white dark:bg-gray-900',
            {
              shadow: scrolled,
              'top-0': !preview,
              'top-8': preview,
            },
          )}>
          <div
            className={cx(
              'z-20 absolute top-0 left-0 overflow-hidden',
              'flex items-center h-14 lg:h-16 px-2',
              'transform transition-transform duration-200 ease-out',
              {
                '-translate-x-14': !showMini,
              },
            )}>
            <Link href="/" shallow={router.pathname === '/[[...slug]]'}>
              <a className="inline-flex mr-2 transform scale-90 lg:scale-100">
                <Image
                  className="rounded-full"
                  height={44}
                  loading="eager"
                  src="/logo.jpg"
                  width={44}
                />
              </a>
            </Link>
            <button className="font-sans flex items-center px-1">
              <MenuIcon className="w-7 h-7 mr-2" fontSize="large" />
              <span className="uppercase text-sm tracking-widest lg:hidden xl:inline">
                Menu
              </span>
            </button>
          </div>
          <div
            className={cx(
              'z-30 absolute top-0 right-0 flex items-center h-14 lg:h-16 px-2 xl:px-4 text-gray-400',
              {
                'left-auto': !searchFocused,
                'left-0 lg:left-auto': searchFocused,
              },
            )}>
            <SearchForm
              className={cx({
                hidden: router.pathname === '/search',
                'w-32 lg:w-32 xl:w-44': !searchFocused,
                'w-full lg:w-60 xl:w-44': showMini && searchFocused,
                'w-full xl:w-80': !showMini && searchFocused,
              })}
              onBlur={() => setSearchFocused(false)}
              onFocus={() => setSearchFocused(true)}
            />
          </div>
        </div>
      </ConditionalHeadroom>
      <header
        className={cx(
          'py-12 sm:py-16 px-3 lg:py-12 xl:py-16 text-center bg-white dark:bg-gray-900 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-950 lg:bg-none',
          { 'mt-8': preview },
        )}
        ref={ref}>
        <Link href="/" shallow={router.pathname === '/[[...slug]]'}>
          <a className="inline-flex flex-col items-center">
            <Image
              className="rounded-full"
              height={120}
              loading="eager"
              src="/logo.jpg"
              width={120}
            />
            <h1 className="text-3xl xl:text-4xl my-2 text-gray-700 dark:text-gray-200 font-display antialiased">
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
