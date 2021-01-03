import cx from 'classnames';
import { gql } from 'graphql-request';
import Image from 'next/image';
import { useRouter } from 'next/router';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import LaunchIcon from '@material-ui/icons/Launch';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';

const Map = ({ data }) => {
  const router = useRouter();
  return (
    <div className="lg:rounded-lg overflow-hidden">
      <div
        className={cx(
          'relative p-8 text-center dark:bg-opacity-10 dark:text-white lg:rounded-t-lg font-display',
          {
            'bg-blue-300 dark:bg-blue-500': router.asPath === '/',
            'bg-amber-400': router.asPath.startsWith('/hotel-reviews'),
            'text-white bg-green-600': router.asPath.startsWith(
              '/motorbike-guides',
            ),
            'text-white bg-yellow-900': router.asPath.startsWith(
              '/destinations',
            ),
            'bg-yellow-200': router.asPath.startsWith('/food-drink'),
          },
        )}>
        <h3
          className="text-2xl sm:text-3xl"
          id="map"
          style={{ scrollMarginTop: '2rem' }}>
          {data.title}
        </h3>
        <p className="mt-2 mb-4 sm:px-16 mx-auto text-sm md:text-base font-serif dark:text-gray-400">
          {data.description}
        </p>
        <a
          className="
            px-3 py-2 inline-flex items-center
            text-sm sm:text-base font-sans hover:underline
            bg-white bg-opacity-90 text-gray-800 rounded-full shadow-md"
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
        <div className="overflow-hidden">
          <div
            className="relative w-full"
            style={{ height: '650px', marginBottom: '-14px' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              height="650"
              src={`https://www.google.com/maps/d/embed?mid=${data.mid}&z=5&hl=en`}
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
