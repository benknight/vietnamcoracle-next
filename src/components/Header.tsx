import cx from 'classnames';
import _debounce from 'lodash/debounce';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRef, useState, useEffect } from 'react';
import Headroom from 'react-headroom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import SearchForm from './SearchForm';

interface Props {
  preview?: boolean;
}

export default function Header({ preview = false }: Props) {
  const ref = useRef<HTMLElement>();
  const [scrolled, setScolled] = useState(false);
  const [showMini, setShowMini] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const isLarge = useMediaQuery('(min-width: 1024px');

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

  const router = useRouter();
  const Wrapper = isLarge ? 'div' : Headroom;

  return (
    <>
      <Wrapper>
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
              'z-10 absolute top-0 left-0 overflow-hidden',
              'flex items-center h-14 lg:h-16 px-2',
              'transform transition-transform duration-200 ease-out',
              {
                '-translate-x-16': !showMini,
              },
            )}>
            <Link href="/" shallow={router.pathname === '/[[...slug]]'}>
              <a className="inline-flex mr-4 md:mr-2 transform scale-90 lg:scale-100">
                <Image
                  className="rounded-full"
                  height={42}
                  loading="eager"
                  src="/logo.jpg"
                  width={42}
                />
              </a>
            </Link>
          </div>
          <div
            className={cx(
              'absolute top-0 right-0 flex items-center h-14 lg:h-16 px-2 xl:px-4 text-gray-400',
              {
                'left-0 sm:left-auto': !showMini,
              },
            )}>
            {router.pathname === '/search' ? null : (
              <SearchForm
                className={cx({
                  'w-40 lg:w-28 xl:w-44': showMini && !searchFocused,
                  'w-56 lg:w-60 xl:w-44': showMini && searchFocused,
                  'w-full xl:w-44': !showMini && !searchFocused,
                  'w-full xl:w-72': !showMini && searchFocused,
                })}
                onBlur={() => setSearchFocused(false)}
                onFocus={() => setSearchFocused(true)}
              />
            )}
          </div>
        </div>
      </Wrapper>
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
