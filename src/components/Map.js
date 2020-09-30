import { graphql } from 'gatsby';
import React from 'react';
import LaunchIcon from '@material-ui/icons/Launch';
import gMapsLogo from '../assets/google-maps-logo.svg';

export default function Map({ data }) {
  return (
    <div className="lg:rounded-lg overflow-hidden shadow">
      <div
        className="
          relative p-8 text-center font-display
          bg-blue-100 dark:bg-green-900 dark:bg-opacity-50 dark:text-white
          dark:border dark:border-gray-700 lg:rounded-t-lg">
        <h3 className="text-2xl sm:text-3xl">{data.title}</h3>
        <p className="mt-2 mb-4 sm:px-16 text-sm sm:text-base font-sans">
          {data.description}
        </p>
        <a
          className="
            px-3 py-1 inline-flex items-center
            dark:text-gray-200 text-sm sm:text-base font-sans
            border border-black dark:border-white rounded-full shadow"
          href={`https://www.google.com/maps/d/viewer?mid=${data.mid}`}>
          <img alt="" className="block w-8 h-8 mr-1" src={gMapsLogo} />
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
}

export const query = graphql`
  fragment MapComponentData on WpComponent_Map {
    description
    title
    mid
  }
`;
