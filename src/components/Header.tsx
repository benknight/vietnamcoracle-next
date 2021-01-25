import cx from 'classnames';
import _debounce from 'lodash/debounce';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRef, useState, useEffect } from 'react';
import Headroom from 'react-headroom';
import Tooltip from '@material-ui/core/Tooltip';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import FacebookIcon from '@material-ui/icons/Facebook';
import SearchIcon from '@material-ui/icons/Search';
import TwitterIcon from '@material-ui/icons/Twitter';
import YouTubeIcon from '@material-ui/icons/YouTube';

interface Props {
  preview?: boolean;
}

export default function Header({ preview = false }: Props) {
  const ref = useRef<HTMLElement>();
  const [scrolled, setScolled] = useState(false);
  const [showMini, setShowMini] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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
            'w-full h-16 lg:h-auto lg:fixed z-30 bg-white dark:bg-gray-900',
            {
              'shadow-lg': scrolled,
              'top-0': !preview,
              'top-8': preview,
            },
          )}>
          <div
            className={cx(
              'z-10 absolute top-0 left-0',
              'flex items-center h-16 px-4',
              'transform transition-transform duration-200 ease-out',
              {
                '-translate-x-16': !showMini,
                'right-0 lg:w-96': searchFocused,
                '-right-16': !showMini && searchFocused,
              },
            )}>
            <Link href="/" shallow={router.pathname === '/[[...slug]]'}>
              <a className="inline-flex mr-4 md:mr-2">
                <Image
                  className="rounded-full"
                  height={48}
                  loading="eager"
                  src="/logo.jpg"
                  width={48}
                />
              </a>
            </Link>
            <form
              className={cx('relative flex-auto w-40 xl:w-44', {
                'lg:w-10': showMini,
              })}
              onSubmit={event => {
                event.preventDefault();
                router.push({
                  pathname: '/search',
                  query: { query: searchQuery },
                });
              }}>
              <div className="absolute top-0 left-0 bottom-0 w-10 flex items-center justify-center pointer-events-none">
                <SearchIcon classes={{ root: 'w-5 h-5' }} />
              </div>
              <input
                className={cx('form-field w-full h-10 pl-8 pr-1 rounded-full', {
                  'pr-2': searchFocused,
                })}
                onBlur={() => setSearchFocused(false)}
                onChange={event => setSearchQuery(event.target.value)}
                onFocus={() => setSearchFocused(true)}
                type="search"
                value={searchQuery}
              />
            </form>
          </div>
          <div className="absolute top-0 right-0 flex items-center h-16 px-4 lg:px-2 xl:px-4 text-gray-400">
            <a href="https://www.facebook.com/vietnamcoracle">
              <Tooltip
                title="Vietnam Coracle on Facebook"
                aria-label="Vietnam Coracle on Facebook"
                arrow>
                <FacebookIcon classes={{ root: 'w-8 h-8' }} />
              </Tooltip>
            </a>
            <a className="ml-2" href="https://www.facebook.com/vietnamcoracle">
              <Tooltip
                title="Vietnam Coracle on Twitter"
                aria-label="Vietnam Coracle on Twitter"
                arrow>
                <TwitterIcon classes={{ root: 'w-8 h-8' }} />
              </Tooltip>
            </a>
            <a className="ml-2" href="https://www.facebook.com/vietnamcoracle">
              <Tooltip
                title="Vietnam Coracle on YouTube"
                aria-label="Vietnam Coracle on YouTube"
                arrow>
                <YouTubeIcon classes={{ root: 'w-8 h-8' }} />
              </Tooltip>
            </a>
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
          <a className="inline-flex">
            <Image
              className="rounded-full"
              height={120}
              loading="eager"
              src="/logo.jpg"
              width={120}
            />
          </a>
        </Link>
        <h1 className="text-4xl mb-2 text-gray-800 dark:text-gray-200 font-display">
          Vietnam Coracle
        </h1>
        <h2 className="text-gray-600 text-xxs uppercase tracking-widest font-serif">
          Independent travel guides to Vietnam
        </h2>
      </header>
    </>
  );
}
