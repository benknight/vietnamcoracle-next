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
    title: 'Motorbike Guides',
    titleShort: 'Motorbike',
    url: '/browse/motorbike-guides',
  },
  {
    icon: <HotelIcon />,
    iconAlt: <HotelOutlinedIcon />,
    title: 'Hotel Reviews',
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
    url: '/browse/food-and-drink',
  },
];

interface Props {
  preview?: boolean;
}

export default function Nav({ preview = false }: Props) {
  const router = useRouter();
  return (
    <>
      <nav
        className={cx(
          'fixed bottom-0 xl:sticky xl:bottom-auto xl:top-0 z-20 flex justify-center w-full h-14 xl:h-16 bg-white dark:bg-gray-900 border-b border-white dark:border-black shadow-inner xl:shadow',
          {
            'xl:top-0': !preview,
            'xl:top-8': preview,
          },
        )}>
        <div
          className="flex justify-center flex-auto px-1 xl:px-16 font-sans lg:font-display tracking-wide leading-tight border-t border-gray-300 dark:border-gray-700"
          style={{ marginTop: '-1px' }}>
          {links.map(link => {
            const path = router.asPath;
            const isCurrent =
              link.url === '/'
                ? path === '/browse' || path === '/'
                : path.startsWith(link.url);
            const to = link.url.match(/\/$/) ? link.url : link.url + '/';
            return (
              <Link href={to} key={to}>
                <a
                  className={cx(
                    'group w-1/5 md:w-28 xl:w-auto sm:px-3 xl:px-3 xl:py-0 flex flex-col xl:flex-row items-center justify-center text-center',
                    {
                      'bg-gradient-to-b dark:shadow text-blue-500 dark:text-blue-400': isCurrent,
                    },
                  )}
                  key={link.url}>
                  <div className="xl:mr-2">
                    {cloneElement(isCurrent ? link.icon : link.iconAlt, {
                      className: 'w-6 h-6 mb-1',
                    })}
                  </div>
                  <div
                    className={cx(
                      'w-full text-shadow xl:border-b break-words group-hover:border-gray-500 dark:group-hover:border-gray-600',
                      isCurrent
                        ? 'border-blue-500 dark:border-blue-400 group-hover:border-blue-500 dark:group-hover:border-blue-400'
                        : 'border-transparent',
                    )}>
                    <div className="xl:hidden text-xxs xl:text-base">
                      {link.titleShort}
                    </div>
                    <div className="hidden xl:block text-sm">{link.title}</div>
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
