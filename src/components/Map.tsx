import cx from 'classnames';
import { useState } from 'react';
import { ExternalLinkIcon } from '@heroicons/react/solid';
import { CursorClickIcon } from '@heroicons/react/outline';
import useNavCategory from '../lib/useNavCategory';
import { BlockContent, BlockTitle } from './Block';

const Map = ({ data }) => {
  const navCategory = useNavCategory();
  const [mapInteractive, setMapInteractive] = useState(false);
  return (
    <div id="map">
      <div className="lg:rounded-lg overflow-hidden">
        <div
          className={cx(
            'relative pt-8 pb-2 px-6 md:pt-10 text-center dark:text-white lg:rounded-t-lg font-display',
            {
              'bg-blue-100 dark:bg-blue-500/10': navCategory === null,
              'bg-amber-500/40 dark:bg-amber-500/10':
                navCategory === 'hotel-reviews',
              'bg-emerald-700/40 dark:bg-emerald-500/20':
                navCategory === 'motorbike-guides',
              'bg-yellow-700/40 dark:bg-yellow-800/20':
                navCategory === 'destinations',
              'bg-yellow-400/50 dark:bg-yellow-500/10':
                navCategory === 'food-and-drink',
            },
          )}>
          <BlockTitle>{data.title}</BlockTitle>
          <BlockContent>
            {data.description}{' '}
            <div className="mt-3">
              <a
                className="link inline-flex items-center hover:underline"
                href={`https://www.google.com/maps/d/viewer?mid=${data.mid}`}>
                Open in Google Maps
                <ExternalLinkIcon className="ml-1 w-4 h-4" />
              </a>
            </div>
          </BlockContent>
        </div>
        <div className="relative">
          <div className="overflow-hidden">
            <div className="h-[80vh] mb-[-14px]">
              <iframe
                className="absolute inset-0 w-full h-full"
                height="650"
                src={`https://www.google.com/maps/d/embed?mid=${data.mid}&z=6&hl=en`}
                loading="lazy"
                title={data.title}
                width="800"></iframe>
              <div
                className={cx(
                  'group absolute inset-0 transition-all duration-300 cursor-pointer flex items-center justify-center text-xl font-display font-medium backdrop-saturate-50',
                  mapInteractive ? 'hidden' : 'flex',
                )}
                onClick={() => setMapInteractive(true)}>
                <button className="flex items-center justify-center w-1/2 p-4 dark:text-white rounded-full bg-white/75 hover:pointer:bg-white/90 dark:bg-black/60 dark:hover:pointer:bg-black/75 shadow-lg transition-colors duration-150 text-blue-500 pointer:opacity-0 group-hover:pointer:opacity-100">
                  <CursorClickIcon className="w-8 h-8 mr-2" /> Click to interact
                  with the map
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
