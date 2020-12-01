import cx from 'classnames';
import { gql } from 'graphql-request';
import Image from 'next/image';
import { useRouter } from 'next/router';
import LaunchIcon from '@material-ui/icons/Launch';
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
      <iframe
        className="shadow w-full"
        height="600"
        src={`https://www.google.com/maps/d/u/0/embed?mid=${data.mid}`}
        title={data.title}
        width="800"></iframe>
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