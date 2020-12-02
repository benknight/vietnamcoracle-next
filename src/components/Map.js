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
          `relative p-8 text-center bg-opacity-50 dark:text-white dark:border dark:border-black lg:rounded-t-lg font-display`,
          {
            [`bg-blue-300 dark:bg-blue-900`]: theme === 'blue',
            [`bg-green-300 dark:bg-green-900`]: theme === 'green',
            [`bg-red-300 dark:bg-red-900`]: theme === 'red',
            [`bg-yellow-300 dark:bg-yellow-900`]: theme === 'yellow',
            [`bg-purple-300 dark:bg-purple-900`]: theme === 'purple',
          },
        )}>
        <h3 className="text-2xl sm:text-3xl">{data.title}</h3>
        <p className="mt-2 mb-4 sm:px-16 mx-auto max-w-xl text-sm font-serif">
          {data.description}
        </p>
        <a
          className="
            px-3 py-2 inline-flex items-center
            dark:text-gray-200 text-sm sm:text-base font-sans hover:underline
            bg-white dark:bg-black bg-opacity-50 rounded-full shadow-md"
          href={`https://www.google.com/maps/d/viewer?mid=${data.mid}`}>
          <div className="inline-flex mr-2">
            <Image
              alt=""
              height="24"
              layout="fixed"
              src="/google-maps-logo.svg"
              width="24"
            />
          </div>
          Open in Google Maps
          <LaunchIcon className="ml-2" fontSize="small" />
        </a>
      </div>
      <div className="relative">
        <div
          className={cx(
            'absolute inset-x-0 top-0 flex items-center px-4 bg-gray-100 dark:text-white dark:bg-black pointer-events-none',
            {
              [`bg-blue-300`]: theme === 'blue',
              [`bg-green-300`]: theme === 'green',
              [`bg-red-300`]: theme === 'red',
              [`bg-yellow-300`]: theme === 'yellow',
              [`bg-purple-300`]: theme === 'purple',
            },
          )}
          style={{ height: '54px' }}>
          <div className="flex-auto">
            <MenuOpenIcon fontSize="large" />
          </div>
          <FullscreenIcon fontSize="large" />
        </div>
        <div className="overflow-hidden">
          <div style={{ marginBottom: '-14px' }}>
            <iframe
              className="w-full"
              height="800"
              src={`https://www.google.com/maps/d/embed?mid=${data.mid}&z=6`}
              title={data.title}
              width="800"></iframe>
          </div>
        </div>
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
