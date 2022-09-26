import cx from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { ExternalLinkIcon } from '@heroicons/react/solid';
import { CursorClickIcon } from '@heroicons/react/outline';

const Map = ({ data }) => {
  const router = useRouter();
  const [mapInteractive, setMapInteractive] = useState(false);
  const { browse } = router.query;
  return (
    <div id="map">
      <div className="lg:rounded-lg overflow-hidden">
        <div
          className={cx(
            'relative py-8 px-6 md:p-10 text-center dark:text-white lg:rounded-t-lg font-display',
            {
              'bg-indigo-100 dark:bg-indigo-500/20':
                browse === 'features-guides',
              'bg-amber-500/40 dark:bg-amber-500/10':
                browse?.[0] === 'hotel-reviews',
              'bg-emerald-700/40 dark:bg-emerald-500/20':
                browse?.[0] === 'motorbike-guides',
              'bg-yellow-700/40 dark:bg-yellow-800/20':
                browse?.[0] === 'destinations',
              'bg-yellow-400/50 dark:bg-yellow-500/10':
                browse?.[0] === 'food-and-drink',
            },
          )}>
          <h3 className="text-xl md:text-2xl">{data.title}</h3>
          <p className="max-w-4xl mt-4 mb-6 sm:px-16 mx-auto text-sm leading-snug md:text-base font-serif dark:text-white/50">
            {data.description}
          </p>
          <a
            className="px-3 py-2 inline-flex items-center text-sm sm:text-base font-sans hover:underline  rounded-full border border-black/20 dark:border-white/20"
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
            <ExternalLinkIcon className="ml-2 w-4 h-4" />
          </a>
        </div>
        <div className="relative">
          <div className="overflow-hidden">
            <div className="h-[95vh] mb-[-14px]">
              <iframe
                className="absolute inset-0 w-full h-full"
                height="650"
                src={`https://www.google.com/maps/d/embed?mid=${data.mid}&z=6&hl=en`}
                title={data.title}
                width="800"></iframe>
              <div
                className={cx(
                  'group absolute inset-0 transition-all duration-300 cursor-pointer flex items-center justify-center text-2xl font-sans font-medium backdrop-saturate-50',
                  mapInteractive ? 'hidden' : 'hidden pointer:flex',
                )}
                onClick={() => setMapInteractive(true)}>
                <button className="flex items-center justify-center w-2/3 p-8 dark:text-white rounded-xl bg-white/75 hover:bg-white/90 dark:bg-black/60 dark:hover:bg-black/75 shadow-lg transition-colors duration-150 text-indigo-400 opacity-0 group-hover:opacity-100">
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
