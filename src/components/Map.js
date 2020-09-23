import { graphql } from 'gatsby';
import React from 'react';
import LaunchIcon from '@material-ui/icons/Launch';
import gMapsLogo from '../assets/google-maps-logo.svg';

export default function Map({ data }) {
  return (
    <>
      <div
        className="relative p-8 bg-blue-100 text-blue-900 text-center font-display"
        style={{ marginBottom: '-55px' }}>
        <h3 className="text-2xl sm:text-3xl">{data.title}</h3>
        <p className="mt-2 mb-4 sm:px-16 text-sm sm:text-base font-sans">
          {data.description}
        </p>
        <a
          className="px-3 py-1 inline-flex items-center text-blue-700 text-sm sm:text-base border border-blue-200 rounded-full font-sans"
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
    </>
  );
}

export const query = graphql`
  fragment MapComponentData on WpComponent_Map {
    description
    title
    mid
  }
`;
