import cx from 'classnames';
import _defer from 'lodash/defer';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { getThemeFromPathname } from '../config/themes';

const links = [
  {
    title: 'Motorbike guides',
    url: '/motorbike-guides',
  },
  {
    title: 'Hotel reviews',
    url: '/hotel-reviews',
  },
  {
    title: 'Food & Drink',
    url: '/food-drink',
  },
  {
    title: 'Destinations',
    url: '/destinations',
  },
];

export default function Nav() {
  const router = useRouter();
  const scrollAnchor = React.useRef();
  return (
    <>
      <div ref={scrollAnchor} />
      <nav
        className={cx(
          'nav sticky top-0 z-20',
          'flex justify-center w-full h-16',
          'bg-white dark:bg-gray-900 shadow-lg',
        )}>
        <div
          className="flex lg:justify-center flex-auto px-16 max-w-screen-lg text-xs border-t border-gray-300 dark:border-gray-700 font-serif uppercase tracking-widest"
          style={{ marginTop: '-1px' }}>
          {links.map(link => {
            const isCurrent = router.asPath.startsWith(link.url);
            const theme = getThemeFromPathname(link.url);
            const to = link.url.match(/\/$/) ? link.url : link.url + '/';
            return (
              <Link href={to} key={to} scroll={false} shallow>
                <a
                  className={cx(
                    `flex items-center text-sm from-${theme}-200 to-${theme}-200 dark:from-${theme}-800 dark:to-${theme}-900`,
                    {
                      'px-5 font-bold bg-gradient-to-b dark:shadow': isCurrent,
                      'px-6': !isCurrent,
                    },
                  )}
                  key={link.url}
                  onClick={() => {
                    const { offsetTop } = scrollAnchor.current;
                    if (window.scrollY > offsetTop)
                      window.scroll({ top: offsetTop });
                  }}>
                  <span
                    className={cx(
                      'text-shadow border-b',
                      isCurrent
                        ? 'border-black dark:border-white'
                        : 'border-transparent',
                    )}>
                    {link.title}
                  </span>
                </a>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
