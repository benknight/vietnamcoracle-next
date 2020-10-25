import cx from 'classnames';
import _defer from 'lodash/defer';
import { graphql, useStaticQuery, Link } from 'gatsby';
import React from 'react';
import { getThemeFromPathname } from '../config/themes';

export default function Nav() {
  const scrollAnchor = React.useRef();
  const data = useStaticQuery(graphql`
    {
      nav: wpComponent(slug: { eq: "category-nav" }) {
        nav {
          links {
            link {
              title
              url
            }
          }
        }
      }
    }
  `);
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
          {data.nav.nav.links.map(item => {
            const theme = getThemeFromPathname(item.link.url);
            const to = item.link.url.match(/\/$/)
              ? item.link.url
              : item.link.url + '/';
            return (
              <Link
                getProps={({ isCurrent }) => ({
                  className: cx(
                    'flex items-center text-sm',
                    `from-${theme}-200 to-${theme}-200`,
                    `dark:from-${theme}-800 dark:to-${theme}-900`,
                    {
                      'px-5 font-bold bg-gradient-to-b dark:shadow': isCurrent,
                      'px-6': !isCurrent,
                    },
                  ),
                  children: (
                    <span
                      className={cx(
                        'text-shadow border-b',
                        isCurrent
                          ? 'border-black dark:border-white'
                          : 'border-transparent',
                      )}>
                      {item.link.title}
                    </span>
                  ),
                })}
                onClick={() => {
                  const { offsetTop } = scrollAnchor.current;
                  if (window.scrollY > offsetTop)
                    window.scroll({ top: offsetTop, behavior: 'smooth' });
                }}
                key={item.link.url}
                to={to}
              />
            );
          })}
        </div>
      </nav>
    </>
  );
}
