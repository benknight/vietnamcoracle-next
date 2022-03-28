import cx from 'classnames';
import _defer from 'lodash/defer';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { cloneElement, useCallback } from 'react';
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
    icon: <WorkIcon />,
    iconAlt: <WorkOutlineIcon />,
    title: 'Destinations',
    titleShort: 'Destinations',
    url: '/browse/destinations/',
  },
  {
    icon: <MotorcycleIcon />,
    iconAlt: <MotorcycleIcon />,
    title: 'Motorbike Guides',
    titleShort: 'Motorbike',
    url: '/browse/motorbike-guides/',
  },
  {
    icon: <HotelIcon />,
    iconAlt: <HotelOutlinedIcon />,
    title: 'Hotel Reviews',
    titleShort: 'Hotels',
    url: '/browse/hotel-reviews/',
  },
  {
    icon: <RestaurantIcon />,
    iconAlt: <RestaurantIcon />,
    title: 'Food & Drink',
    titleShort: 'Food',
    url: '/browse/food-and-drink/',
  },
];

interface Props {
  navCategory?: string;
  preview: boolean;
}

export default function NavBar({ navCategory, preview }: Props) {
  const router = useRouter();
  const isCurrent = useCallback(
    uri => {
      const path = router.asPath;
      if (uri === '/') {
        return path === '/browse' || path === '/';
      }
      if (router.query.ref) {
        return uri === `/browse/${router.query.ref}/`;
      }
      if (navCategory) {
        return uri === `/browse/${navCategory}/`;
      }
      return path.startsWith(uri);
    },
    [navCategory, router.asPath, router.query.ref],
  );
  return (
    <>
      <nav className="nav-bar fixed lg:sticky lg:top-0 bottom-0 lg:bottom-auto z-20 w-full h-16 bg-gray-100 md:bg-white dark:bg-gray-900 md:dark:bg-gray-900 lg:shadow-xl">
        <div className="flex justify-center items-center flex-auto px-1 xl:px-16 font-sans font-medium tracking-wide lg:tracking-normal leading-tight ring-1 ring-gray-300 dark:ring-gray-700 lg:ring-0">
          {links.map(link => {
            const to = link.url.match(/\/$/) ? link.url : link.url + '/';
            return (
              <Link href={to} key={to}>
                <a
                  className={cx(
                    'w-1/5 md:w-24 lg:w-auto h-16 lg:h-10 mx-1 lg:mx-[2px] sm:px-3 lg:px-3',
                    'flex flex-col lg:flex-row items-center justify-center text-center',
                    'rounded-full transition-colors duration-200 ease',
                    'lg:hover:bg-gray-100 lg:hover:border-gray-100 lg:dark:bg-gray-900 lg:dark:hover:bg-gray-800',
                    {
                      'dark:shadow text-primary-500 dark:text-primary-400':
                        isCurrent(link.url),
                      'nav-link-home': link.url === '/',
                    },
                  )}
                  key={link.url}
                  style={{ WebkitTapHighlightColor: 'transparent' }}>
                  {cloneElement(
                    isCurrent(link.url) ? link.icon : link.iconAlt,
                    {
                      className: 'w-5 h-5 lg:mr-2 mb-1 lg:mb-0 shrink-0',
                    },
                  )}
                  <div className="w-full">
                    <div className="xl:hidden text-xxxs xs:text-xxs lg:text-base">
                      {link.titleShort}
                    </div>
                    <div className="hidden xl:block">{link.title}</div>
                  </div>
                </a>
              </Link>
            );
          })}
        </div>
        {preview && (
          <div className="absolute top-full left-0 w-full flex justify-center">
            <Link
              href={`/api/exit-preview/?redirect=${encodeURIComponent(
                router.asPath,
              )}`}>
              <a className="flex items-center justify-center h-5 px-6 bg-yellow-300 hover:bg-yellow-400 text-black text-xs font-medium shadow rounded-b-sm">
                You are viewing this site in Preview Mode. Click here to exit.
              </a>
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}
