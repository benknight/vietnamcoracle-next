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
import WorkOutlineIcon from '@material-ui/icons/WorkOutline';

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
    url: '/browse/motorbike-guides',
  },
  {
    icon: <HotelIcon />,
    iconAlt: <HotelOutlinedIcon />,
    title: 'Hotel reviews',
    titleShort: 'Hotels',
    url: '/browse/hotel-reviews',
  },
  {
    icon: <WorkIcon />,
    iconAlt: <WorkOutlineIcon />,
    title: 'Destinations',
    titleShort: 'Travel',
    url: '/browse/destinations',
  },
  {
    icon: <RestaurantIcon />,
    iconAlt: <RestaurantIcon />,
    title: 'Food & Drink',
    titleShort: 'Food',
    url: '/browse/food-drink',
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
          bg-white dark:bg-gray-900 border-b border-white dark:border-black shadow">
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
            const to = link.url.match(/\/$/) ? link.url : link.url + '/';
            return (
              <Link href={to} key={to} scroll={false}>
                <a
                  className={cx(
                    'w-1/5 lg:w-auto sm:p-4 lg:py-0 lg:px-3 xl:px-4 flex flex-col lg:flex-row items-center justify-center text-center',
                    {
                      'bg-gradient-to-b dark:shadow text-blue-500 dark:text-blue-400': isCurrent,
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
                      className: 'w-6 h-6 mb-1',
                    })}
                  </div>
                  <div
                    className={cx(
                      'w-full mt-1 lg:mt-0 text-shadow lg:border-b break-words',
                      isCurrent
                        ? 'border-blue-500 dark:border-blue-400'
                        : 'border-transparent',
                    )}>
                    <div className="lg:hidden">{link.titleShort}</div>
                    <div className="hidden lg:block">{link.title}</div>
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
