import cx from 'classnames';
import _defer from 'lodash/defer';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { cloneElement, useRef } from 'react';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import HotelIcon from '@material-ui/icons/Hotel';
import HotelOutlinedIcon from '@material-ui/icons/HotelOutlined';
import LocalCafeIcon from '@material-ui/icons/LocalCafe';
import LocalCafeOutlinedIcon from '@material-ui/icons/LocalCafeOutlined';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import MotorcycleIcon from '@material-ui/icons/Motorcycle';
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
    titleShort: 'Guides',
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
    icon: <LocalCafeIcon />,
    iconAlt: <LocalCafeOutlinedIcon />,
    title: 'Food & Drink',
    titleShort: 'Food',
    url: '/food-drink',
  },
  {
    icon: <LocationOnIcon />,
    iconAlt: <LocationOnOutlinedIcon />,
    title: 'Destinations',
    titleShort: 'Places',
    url: '/destinations',
  },
];

export default function Nav() {
  const router = useRouter();
  const scrollAnchor = useRef();
  return (
    <>
      <div ref={scrollAnchor} />
      <nav
        className={cx(
          'fixed bottom-0 lg:sticky lg:bottom-auto lg:top-0 z-20',
          'flex justify-center w-full h-16',
          'bg-white dark:bg-gray-900 shadow-lg',
        )}>
        <div
          className="flex lg:justify-center flex-auto px-1 lg:px-16 max-w-screen-lg text-xxxs sm:text-xxs border-t border-gray-300 dark:border-gray-700 font-serif uppercase tracking-widest leading-tight"
          style={{ marginTop: '-1px' }}>
          {links.map(link => {
            const path = router.asPath;
            const isCurrent = path === link.url;
            const theme = getThemeFromPathname(link.url);
            const to = link.url.match(/\/$/) ? link.url : link.url + '/';
            return (
              <Link href={to} key={to} scroll={false} shallow>
                <a
                  className={cx(
                    'w-1/5 lg:w-auto sm:p-4 lg:py-0 flex flex-col lg:flex-row items-center justify-center text-center',
                    {
                      [`
                        lg:from-${theme}-200 lg:to-${theme}-200
                        lg:dark:from-${theme}-700 lg:dark:to-${theme}-900`]:
                        link.url !== '/',
                      [`bg-gradient-to-b dark:shadow text-${theme}-500 lg:text-gray-800 lg:dark:text-white`]: isCurrent,
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
