import cx from 'classnames';
import { gql } from 'graphql-request';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import LaunchIcon from '@material-ui/icons/Launch';
import { getThemeFromPathname } from '../config/themes';

const Map = ({ data }) => {
  const router = useRouter();
  const theme = getThemeFromPathname(router.asPath);
  return (
    <div className="lg:rounded-lg">
      <div
        className={cx(
          `relative p-8 text-center font-display dark:bg-opacity-50 dark:text-white dark:border dark:border-black lg:rounded-t-lg bg-${theme}-200 dark:bg-${theme}-900`,
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
            className="block w-8 h-8 mr-1"
            src="/google-maps-logo.svg"
            unsized
          />
          Open in Google Maps
          <LaunchIcon className="ml-2" />
        </a>
      </div>
      <iframe
        className="shadow"
        height="600"
        src={`https://www.google.com/maps/d/u/0/embed?mid=${data.mid}`}
        title={data.title}
        width="100%"></iframe>
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
