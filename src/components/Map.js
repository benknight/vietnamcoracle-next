import cx from 'classnames';
import { gql } from 'graphql-request';
import Image from 'next/image';
import { useRouter } from 'next/router';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import LaunchIcon from '@material-ui/icons/Launch';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import { getThemeFromPathname } from '../config/themes';

const Map = ({ data }) => {
  const router = useRouter();
  const theme = getThemeFromPathname(router.asPath);
  return (
    <div className="lg:rounded-lg">
      <div
        className={cx(
          `relative p-8 text-center dark:bg-opacity-50 dark:text-white dark:border dark:border-black lg:rounded-t-lg font-display`,
          {
            [`bg-blue-200 dark:bg-blue-900`]: theme === 'blue',
            [`bg-green-200 dark:bg-green-900`]: theme === 'green',
            [`bg-red-200 dark:bg-red-900`]: theme === 'red',
            [`bg-yellow-200 dark:bg-yellow-900`]: theme === 'yellow',
            [`bg-purple-200 dark:bg-purple-900`]: theme === 'purple',
          },
        )}>
        <h3 className="text-2xl sm:text-3xl">{data.title}</h3>
        <p className="mt-2 mb-4 sm:px-16 text-sm sm:text-base font-serif">
          {data.description}
        </p>
        <a
          className="
            px-3 py-1 inline-flex items-center
            dark:text-gray-200 text-sm sm:text-base font-sans hover:underline
            bg-white dark:bg-black bg-opacity-75 dark:bg-opacity-25 rounded-full shadow-md"
          href={`https://www.google.com/maps/d/viewer?mid=${data.mid}`}>
          <Image
            alt=""
            className="block mr-1"
            height="32"
            layout="fixed"
            src="/google-maps-logo.svg"
            width="32"
          />
          Open in Google Maps
          <LaunchIcon className="ml-2" />
        </a>
      </div>
      <div className="relative">
        <div
          className="
            absolute inset-x-0 top-0
            flex items-center px-4
            bg-gray-100 dark:text-white dark:bg-gray-950
            pointer-events-none"
          style={{ height: '54px' }}>
          <div className="flex-auto">
            <MenuOpenIcon fontSize="large" />
          </div>
          <FullscreenIcon fontSize="large" />
        </div>
        <iframe
          className="shadow w-full"
          height="800"
          src={`https://www.google.com/maps/d/embed?mid=${data.mid}&z=6`}
          title={data.title}
          width="800"></iframe>
      </div>
    </div>
  );
};

Map.fragments = gql`
  fragment MapComponentData on Component_Map {
    description
    title
    mid
  }
`;

export default Map;
