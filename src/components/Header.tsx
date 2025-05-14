'use client';
import cx from 'classnames';
import _debounce from 'lodash/debounce';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useState, useEffect, Suspense } from 'react';
import Headroom from 'react-headroom';
import { Bars3Icon } from '@heroicons/react/24/outline';
import checkHomePath from '../lib/checkHomePath';
import Menu from './Menu';
import Nav from './Nav';
import SearchForm from './SearchForm';

interface Props {
  navCategory?: string;
  preview?: boolean;
  fullWidth?: boolean;
}

export default function Header({ navCategory, preview, fullWidth }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const pathname = usePathname();
  const isHome = checkHomePath(pathname || '/');
  const [pinStart, setPinStart] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const calculatePinStart = () => {
      if (!ref.current) return;
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
    <div ref={ref} role="banner">
      <Headroom
        className="relative z-30 w-full"
        downTolerance={10}
        pinStart={pinStart}>
        <div className="bg-white dark:bg-gray-900">
          <div
            className={cx(
              'relative flex items-center justify-center h-14 lg:h-16',
              fullWidth ? '' : 'max-w-screen-2xl mx-auto',
            )}>
            <div className="z-20 absolute top-0 left-0 flex items-center h-14 lg:h-16 px-1 sm:pl-2">
              <Menu
                className="scale-90 lg:scale-100 origin-left"
                fullWidth={fullWidth}>
                <Bars3Icon className="w-5 h-5 mx-3" />
                <div className="flex -ml-1">
                  <Image
                    alt="Vietnam Coracle logo"
                    className="rounded-full"
                    height={44}
                    loading="eager"
                    src="/logo.svg"
                    width={44}
                  />
                </div>
              </Menu>
              <Link
                href="/"
                className="flex items-center hover:text-black dark:hover:text-white">
                <h1 className="lg:ml-2 font-semibold font-display">
                  Vietnam Coracle
                </h1>
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
              <Suspense>
                <SearchForm
                  className={cx(
                    'ring-2 ring-white md:ring-0 dark:ring-gray-900',
                    {
                      'w-28 xs:w-32': !searchFocused,
                      'md:w-40': !searchFocused && !searchQuery,
                      'md:w-60': !searchFocused && searchQuery,
                      'w-full md:w-60 2xl:w-60': searchFocused,
                    },
                  )}
                  onChange={event => setSearchQuery(event.target.value)}
                  onBlur={() => setSearchFocused(false)}
                  onFocus={() => setSearchFocused(true)}
                />
              </Suspense>
            </div>
            <div className="hidden lg:block">
              <Suspense>
                <Nav navCategory={navCategory} />
              </Suspense>
            </div>
            {preview && (
              <div className="absolute top-full left-0 w-full flex justify-center">
                <Link
                  href={`/api/exit-preview/?redirect=${encodeURIComponent(
                    isHome ? '/' : pathname || '/',
                  )}`}
                  className="flex items-center justify-center h-5 mt-1 px-4 bg-yellow-300 dark:bg-opacity-75 hover:bg-opacity-100 text-black text-xs font-medium shadow rounded-full">
                  You are viewing in Preview Mode. Click here to exit.
                </Link>
              </div>
            )}
          </div>
        </div>
      </Headroom>
      <div className="nav-bar fixed lg:hidden bottom-0 z-20 w-full h-16 bg-gray-100 md:bg-white dark:bg-gray-900 md:dark:bg-gray-900">
        <Suspense>
          <Nav navCategory={navCategory} />
        </Suspense>
      </div>
    </div>
  );
}
