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
import MotorcycleIcon from '@material-ui/icons/TwoWheeler';
import WorkIcon from '@material-ui/icons/Work';
import WorkOutlineIcon from '@material-ui/icons/WorkOutline';
import checkHomePath from '../lib/checkHomePath';

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
}

export default function NavBar({ navCategory }: Props) {
  const router = useRouter();
  const isCurrent = useCallback(
    uri => {
      const path = router.asPath;
      if (uri === '/') {
        return checkHomePath(path);
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
    <nav className="flex justify-around items-center flex-auto px-1 xl:px-16 font-sans font-medium tracking-wide lg:tracking-normal leading-tight ring-1 ring-gray-300 dark:ring-gray-700 lg:ring-0">
      {links.map(link => {
        const to = link.url.match(/\/$/) ? link.url : link.url + '/';
        return (
          <Link href={to} key={to}>
            <a
              className={cx(
                'min-w-[50px] md:w-24 lg:w-auto h-16 lg:h-9 mx-1 lg:mx-[2px] lg:px-3',
                'flex flex-col lg:flex-row items-center justify-center text-center',
                'rounded-full font-display tracking-wide',
                'lg:hover:bg-gray-100 lg:hover:border-gray-100',
                'lg:dark:hover:bg-transparent lg:dark:hover:text-white',
                isCurrent(link.url)
                  ? 'text-primary-500 dark:text-white'
                  : 'dark:text-gray-400',
                {
                  'nav-link-home': checkHomePath(link.url),
                },
              )}
              key={link.url}>
              {cloneElement(isCurrent(link.url) ? link.icon : link.iconAlt, {
                className: '!w-5 !h-5 lg:mr-2 mb-1 lg:mb-[3px] shrink-0',
              })}
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
    </nav>
  );
}
