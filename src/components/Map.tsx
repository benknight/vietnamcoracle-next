import cx from 'classnames';
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
              <svg
                width="18"
                height="18"
                viewBox="0 0 93 133"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M60.77 2.4C56.37 1.01 51.69 0.25 46.83 0.25C32.65 0.25 19.96 6.66 11.5 16.73L33.3 35.07L60.77 2.4Z"
                  fill="currentColor"
                />
                <path
                  d="M11.49 16.73C4.75 24.75 0.68 35.1 0.68 46.39C0.68 55.07 2.41 62.1 5.25 68.4L33.29 35.07L11.49 16.73Z"
                  fill="currentColor"
                />
                <path
                  d="M46.83 28.75C56.58 28.75 64.48 36.65 64.48 46.4C64.48 50.74 62.91 54.72 60.31 57.79C60.31 57.79 74.25 41.21 87.78 25.13C82.19 14.38 72.5 6.11 60.78 2.4L33.29 35.07C36.53 31.2 41.39 28.75 46.83 28.75Z"
                  fill="currentColor"
                />
                <path
                  d="M46.83 64.04C37.08 64.04 29.18 56.14 29.18 46.39C29.18 42.08 30.73 38.13 33.29 35.06L5.25 68.4C10.04 79.03 18.01 87.56 26.22 98.31L60.3 57.79C57.07 61.61 52.23 64.04 46.83 64.04Z"
                  fill="currentColor"
                />
                <path
                  d="M59.63 109.37C75.02 85.3 92.97 74.37 92.97 46.39C92.97 38.72 91.09 31.49 87.78 25.13L26.23 98.31C28.84 101.73 31.47 105.37 34.04 109.38C43.4 123.84 40.8 132.51 46.84 132.51C52.86 132.51 50.27 123.83 59.63 109.37Z"
                  fill="currentColor"
                />
              </svg>
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
