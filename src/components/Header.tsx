import cx from 'classnames';
import _debounce from 'lodash/debounce';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRef, useState, useEffect } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
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

  useEffect(() => {
    const listener = _debounce(() => {
      setScolled(window.scrollY > 0);
      setShowMini(window.scrollY >= ref.current.getBoundingClientRect().height);
    }, 10);
    listener();
    window.addEventListener('scroll', listener);
    return () => window.removeEventListener('scroll', listener);
  }, []);

  const router = useRouter();

  return (
    <header
      className={cx(
        'pt-24 pb-12 sm:pt-20 sm:pb-16 px-3 lg:py-12 text-center bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-950 lg:bg-none',
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
      <div
        className={cx('fixed left-0 z-30 h-16 lg:h-auto w-full', {
          'bg-white dark:bg-gray-900 shadow-lg': scrolled,
          'top-0': !preview,
          'top-8': preview,
        })}>
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
            <a className="inline-flex mr-4">
              <Image
                className="rounded-full"
                height={42}
                loading="eager"
                src="/logo.jpg"
                width={42}
              />
            </a>
          </Link>
          <div className="relative flex-auto w-40 lg:w-12 xl:w-44">
            <div className="absolute top-0 left-0 bottom-0 flex items-center px-3 pointer-events-none">
              <SearchIcon classes={{ root: 'w-6 h-6' }} />
            </div>
            <input
              className="form-field w-full h-10 pl-10 rounded-full"
              onBlur={() => setSearchFocused(false)}
              onFocus={() => setSearchFocused(true)}
              type="search"
            />
          </div>
        </div>
        <div className="absolute top-0 right-0 flex items-center h-16 px-4 lg:px-2 xl:px-4 text-gray-400">
          <a href="https://www.facebook.com/vietnamcoracle">
            <Tooltip
              title="Facebook"
              aria-label="Vietnam Coracle on Facebook"
              arrow>
              <FacebookIcon classes={{ root: 'w-8 h-8' }} />
            </Tooltip>
          </a>
          <a className="ml-2" href="https://www.facebook.com/vietnamcoracle">
            <Tooltip
              title="Twitter"
              aria-label="Vietnam Coracle on Twitter"
              arrow>
              <TwitterIcon classes={{ root: 'w-8 h-8' }} />
            </Tooltip>
          </a>
          <a className="ml-2" href="https://www.facebook.com/vietnamcoracle">
            <Tooltip
              title="YouTube"
              aria-label="Vietnam Coracle on YouTube"
              arrow>
              <YouTubeIcon classes={{ root: 'w-8 h-8' }} />
            </Tooltip>
          </a>
        </div>
      </div>
    </header>
  );
}
