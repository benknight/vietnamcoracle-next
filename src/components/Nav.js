import cx from 'classnames';
import _defer from 'lodash/defer';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRef } from 'react';
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
    url: '/',
  },
  {
    icon: <MotorcycleIcon />,
    iconAlt: <MotorcycleIcon />,
    title: 'Motorbike guides',
    url: '/motorbike-guides',
  },
  {
    icon: <HotelIcon />,
    iconAlt: <HotelOutlinedIcon />,
    title: 'Hotel reviews',
    url: '/hotel-reviews',
  },
  {
    icon: <LocalCafeIcon />,
    iconAlt: <LocalCafeOutlinedIcon />,
    title: 'Food & Drink',
    url: '/food-drink',
  },
  {
    icon: <LocationOnIcon />,
    iconAlt: <LocationOnOutlinedIcon />,
    title: 'Destinations',
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
          'nav sticky top-0 z-20',
          'flex justify-center w-full h-16',
          'bg-white dark:bg-gray-900 shadow-lg',
        )}>
        <div
          className="flex lg:justify-center flex-auto px-16 max-w-screen-lg text-xxs border-t border-gray-300 dark:border-gray-700 font-serif uppercase tracking-widest"
          style={{ marginTop: '-1px' }}>
          {links.map(link => {
            const path = router.asPath;
            const isCurrent = path === link.url;
            const theme = getThemeFromPathname(link.url);
            const to = link.url.match(/\/$/) ? link.url : link.url + '/';
            return (
              <Link href={to} key={to} scroll={false} shallow>
                <a
                  className={cx('flex items-center px-4', {
                    'bg-gradient-to-b dark:shadow': isCurrent,
                    [`from-${theme}-200 to-${theme}-200 dark:from-${theme}-800 dark:to-${theme}-900`]:
                      link.url !== '/',
                  })}
                  key={link.url}
                  onClick={() => {
                    const { offsetTop } = scrollAnchor.current;
                    if (window.scrollY > offsetTop)
                      window.scroll({ top: offsetTop });
                  }}>
                  <div className="mr-2">
                    {isCurrent ? link.icon : link.iconAlt}
                  </div>
                  <div
                    className={cx(
                      'text-shadow border-b',
                      isCurrent
                        ? 'border-black dark:border-white'
                        : 'border-transparent',
                    )}>
                    {link.title}
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
