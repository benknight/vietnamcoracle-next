import cx from 'classnames';
import _defer from 'lodash/defer';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { cloneElement, useRef } from 'react';
import { HomeIcon } from '@heroicons/react/solid';
import { HomeIcon as HomeOutlinedIcon } from '@heroicons/react/outline';
import HotelIcon from '@material-ui/icons/Hotel';
import HotelOutlinedIcon from '@material-ui/icons/HotelOutlined';
import RestaurantIcon from '@material-ui/icons/Restaurant';
import MotorcycleIcon from '@material-ui/icons/Motorcycle';
import WorkIcon from '@material-ui/icons/Work';
import WorkOutlineIcon from '@material-ui/icons/WorkOutline';

const links = [
  {
    icon: <HomeIcon />,
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

export default function NavBar({ preview = false }: Props) {
  const router = useRouter();
  return (
    <>
      <nav
        className={cx(
          'fixed lg:sticky lg:top-0 bottom-0 lg:bottom-auto z-20 flex justify-center w-full h-16 bg-white bg-gradient-to-b from-gray-100 to-gray-200 md:bg-none dark:bg-none dark:bg-gray-900 border-b border-white dark:border-black lg:shadow',
          { 'lg:top-6': preview },
        )}>
        <div className="flex justify-center items-center flex-auto px-1 xl:px-16 font-sans font-medium tracking-wide lg:tracking-normal leading-tight ring-1 ring-gray-300 dark:ring-gray-700 lg:ring-0">
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
                    'w-1/5 md:w-24 lg:w-auto h-10 mx-1 lg:mx-[2px] sm:px-3 lg:px-3',
                    'flex flex-col lg:flex-row items-center justify-center text-center',
                    'rounded-full transition-colors duration-200 ease',
                    'lg:hover:bg-gray-100 lg:hover:border-gray-100 lg:dark:bg-gray-900 lg:dark:hover:bg-gray-800',
                    {
                      'dark:shadow text-indigo-500 dark:text-indigo-400':
                        isCurrent,
                    },
                  )}
                  key={link.url}>
                  {cloneElement(isCurrent ? link.icon : link.iconAlt, {
                    className: 'w-5 h-5 lg:mr-2 mb-1 lg:mb-0 flex-shrink-0',
                  })}
                  <div className="w-full break-words">
                    <div className="nav-title-short text-xxxs xs:text-xxs lg:text-base">
                      {link.titleShort}
                    </div>
                    <div className="nav-title-long">{link.title}</div>
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
