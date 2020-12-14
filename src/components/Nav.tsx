import cx from 'classnames';
import _defer from 'lodash/defer';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { cloneElement, useRef } from 'react';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import HotelIcon from '@material-ui/icons/Hotel';
import HotelOutlinedIcon from '@material-ui/icons/HotelOutlined';
import RestaurantIcon from '@material-ui/icons/Restaurant';
import MotorcycleIcon from '@material-ui/icons/Motorcycle';
import WorkIcon from '@material-ui/icons/Work';
import WorkOutlinedIcon from '@material-ui/icons/WorkOutlined';
import { getThemeFromPathname } from '../config/themes';

const links = [
  {
    icon: <HomeOutlinedIcon />,
    iconAlt: <HomeOutlinedIcon />,
    title: 'Home',
    titleShort: 'Home',
    url: '/',
  },
  {
    icon: <MotorcycleIcon />,
    iconAlt: <MotorcycleIcon />,
    title: 'Motorbike guides',
    titleShort: 'Motorbike',
    url: '/motorbike-guides',
  },
  {
    icon: <HotelIcon />,
    iconAlt: <HotelOutlinedIcon />,
    title: 'Hotel reviews',
    titleShort: 'Hotels',
    url: '/hotel-reviews',
  },
  {
    icon: <WorkIcon />,
    iconAlt: <WorkOutlinedIcon />,
    title: 'Destinations',
    titleShort: 'Travel',
    url: '/destinations',
  },
  {
    icon: <RestaurantIcon />,
    iconAlt: <RestaurantIcon />,
    title: 'Food & Drink',
    titleShort: 'Food',
    url: '/food-drink',
  },
];

export default function Nav() {
  const router = useRouter();
  const scrollAnchor = useRef<HTMLDivElement>();
  return (
    <>
      <div ref={scrollAnchor} />
      <nav
        className="
          fixed bottom-0 lg:sticky lg:bottom-auto lg:top-0 z-20
          flex justify-center w-full h-16
          bg-white dark:bg-gray-900 shadow-lg">
        <div
          className="
            flex lg:justify-center flex-auto
            px-1 lg:px-16 max-w-screen-lg
            text-xxxs sm:text-xxs font-serif uppercase tracking-widest leading-tight
            border-t border-gray-300 dark:border-gray-700"
          style={{ marginTop: '-1px' }}>
          {links.map(link => {
            const path = router.asPath;
            const isCurrent =
              link.url === '/' ? path === '/' : path.startsWith(link.url);
            const theme = getThemeFromPathname(link.url);
            const to = link.url.match(/\/$/) ? link.url : link.url + '/';
            return (
              <Link href={to} key={to} scroll={false}>
                <a
                  className={cx(
                    'w-1/5 lg:w-auto sm:p-4 lg:py-0 lg:px-3 xl:px-4 flex flex-col lg:flex-row items-center justify-center text-center',
                    {
                      'bg-gradient-to-b dark:shadow lg:text-gray-800 lg:dark:text-white': isCurrent,
                      ['lg:from-blue-200 lg:to-blue-200 lg:dark:from-blue-700 lg:dark:to-blue-900']:
                        link.url !== '/' && theme === 'blue',
                      ['lg:from-green-200 lg:to-green-200 lg:dark:from-green-700 lg:dark:to-green-900']:
                        link.url !== '/' && theme === 'green',
                      ['lg:from-red-200 lg:to-red-200 lg:dark:from-red-700 lg:dark:to-red-900']:
                        link.url !== '/' && theme === 'red',
                      ['lg:from-yellow-200 lg:to-yellow-200 lg:dark:from-yellow-700 lg:dark:to-yellow-900']:
                        link.url !== '/' && theme === 'yellow',
                      ['lg:from-purple-200 lg:to-purple-200 lg:dark:from-purple-700 lg:dark:to-purple-900']:
                        link.url !== '/' && theme === 'purple',
                      ['text-blue-500']: isCurrent && theme === 'blue',
                      ['text-green-500']: isCurrent && theme === 'green',
                      ['text-red-500']: isCurrent && theme === 'red',
                      ['text-yellow-500']: isCurrent && theme === 'yellow',
                      ['text-purple-500']: isCurrent && theme === 'purple',
                    },
                  )}
                  key={link.url}
                  onClick={() => {
                    const { offsetTop } = scrollAnchor.current;
                    if (window.scrollY > offsetTop)
                      window.scroll({ top: offsetTop });
                  }}>
                  <div className="lg:mr-2">
                    {cloneElement(isCurrent ? link.icon : link.iconAlt, {
                      className: 'w-6 h-6',
                    })}
                  </div>
                  <div
                    className={cx(
                      'w-full mt-1 lg:mt-0 text-shadow lg:border-b break-words',
                      isCurrent
                        ? 'border-black dark:border-white'
                        : 'border-transparent',
                    )}>
                    <div className="sm:hidden">{link.titleShort}</div>
                    <div className="hidden sm:block">{link.title}</div>
                  </div>
                </a>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
