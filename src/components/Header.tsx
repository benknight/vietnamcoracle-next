import cx from 'classnames';
import _debounce from 'lodash/debounce';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRef, useState, useEffect } from 'react';
import Headroom from 'react-headroom';
import { Transition } from '@headlessui/react';
import { MenuIcon } from '@heroicons/react/outline';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import breakpoints from '../config/breakpoints';
import Menu from './Menu';
import Nav from './Nav';
import SearchForm from './SearchForm';

export default function Header({
  preview,
  navCategory,
}: {
  navCategory?: string;
  preview: boolean;
}) {
  const ref = useRef<HTMLDivElement>();
  const [fullHeaderVisible, setFullHeaderVisible] = useState(true);
  const [searchFocused, setSearchFocused] = useState(false);
  const [pinStart, setPinStart] = useState(0);
  const router = useRouter();
  const isLg = useMediaQuery(`(min-width: ${breakpoints.lg})`);
  const isHome = ['/', '/browse', '/browse/'].includes(router.asPath);
  const showMini = !isHome || !fullHeaderVisible;

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          setFullHeaderVisible(entry.isIntersecting);
        });
      },
      {
        threshold: 0.5,
      },
    );
    observer.observe(ref.current);
    const calculatePinStart = () => {
      const box = ref.current.getBoundingClientRect();
      setPinStart(window.scrollY + box.top);
    };
    calculatePinStart();
    window.addEventListener('resize', calculatePinStart);
    return () => {
      window.removeEventListener('resize', calculatePinStart);
    };
  }, []);

  return (
    <div ref={ref}>
      <Headroom className="relative z-30 w-full" pinStart={pinStart}>
        <div className="relative flex items-center justify-center h-14 lg:h-16 mx-auto bg-white dark:bg-gray-900">
          <div className="z-20 absolute top-0 left-0 flex items-center h-14 lg:h-16 px-1 sm:pl-2">
            <Menu className="scale-90 lg:scale-100 origin-left">
              <MenuIcon className="w-5 h-5 mx-3" />
              <div
                className={
                  showMini
                    ? 'hidden'
                    : 'text-xs tracking-widest uppercase -ml-1 mr-3'
                }>
                Menu
              </div>
              <div className={showMini ? 'flex -ml-1' : 'hidden'}>
                <Image
                  className="rounded-full"
                  height={44}
                  loading="eager"
                  src="/logo.jpg"
                  width={44}
                />
              </div>
            </Menu>
            <Link href="/">
              <a className="flex items-center hover:text-black dark:hover:text-white">
                <Transition
                  enter="transition duration-300"
                  enterFrom="opacity-0 -translate-x-4"
                  enterTo="opacity-100 traslate-x-0"
                  leave="hidden"
                  show={showMini}
                  unmount={false}>
                  <h1 className="lg:ml-2 font-semibold font-display tracking-tight">
                    Vietnam Coracle
                  </h1>
                </Transition>
              </a>
            </Link>
          </div>
          <div
            className={cx(
              'z-30 absolute top-0 right-0',
              {
                'left-auto': !searchFocused,
                '!left-0 md:!left-auto': searchFocused,
              },
              'flex items-center h-14 lg:h-16 px-2 lg:px-4',
            )}>
            <SearchForm
              className={cx('ring-2 ring-white md:ring-0 dark:ring-gray-900', {
                'w-32 md:w-44': !searchFocused,
                'w-full md:w-60 2xl:w-60': searchFocused,
              })}
              onBlur={() => setSearchFocused(false)}
              onFocus={() => setSearchFocused(true)}
            />
          </div>
          <div className="hidden lg:block">
            <Nav navCategory={navCategory} />
          </div>
          {preview && (
            <div className="absolute top-full left-0 w-full flex lg:justify-center">
              <Link
                href={`/api/exit-preview/?redirect=${encodeURIComponent(
                  isHome ? '/' : router.asPath,
                )}`}>
                <a className="flex-auto flex items-center justify-center h-5 px-6 bg-yellow-300 hover:bg-yellow-400 text-black text-xs font-medium shadow">
                  You are viewing this site in Preview Mode. Click here to exit.
                </a>
              </Link>
            </div>
          )}
        </div>
      </Headroom>
      <header
        className={cx(
          'relative py-12 sm:py-16 px-3 xl:pt-12 text-center border-b border-gray-300 dark:border-gray-700',
          'bg-white dark:bg-gray-900 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-950',
          { hidden: !isHome },
        )}>
        <div className="inline-flex flex-col items-center">
          <Link href="/">
            <a className="flex">
              <Image
                className="rounded-full"
                height={120}
                loading="eager"
                src="/logo.jpg"
                width={120}
              />
            </a>
          </Link>
          <h1 className="my-2 text-2xl xs:text-3xl xl:text-4xl text-gray-700 dark:text-white font-display antialiased tracking-[-0.01em]">
            Vietnam Coracle
          </h1>
          <h2
            className="text-xxxxs xl:text-xxxs text-gray-600 dark:text-gray-400 uppercase tracking-widest font-display"
            style={{ wordSpacing: '0.1em' }}>
            Independent travel guides to Vietnam
          </h2>
        </div>
      </header>
      <div className="nav-bar fixed lg:hidden bottom-0 z-20 w-full h-16 bg-gray-100 md:bg-white dark:bg-gray-900 md:dark:bg-gray-900">
        <Nav navCategory={navCategory} />
      </div>
    </div>
  );
}
