import cx from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ExternalLinkIcon } from '@heroicons/react/solid';

const Map = ({ data }) => {
  const router = useRouter();
  const { browse } = router.query;
  return (
    <div id="map">
      <div className="lg:rounded-lg overflow-hidden">
        <div
          className={cx(
            'relative py-8 px-6 md:p-8 text-center dark:bg-opacity-10 dark:text-white lg:rounded-t-lg font-display',
            {
              'bg-blue-100 dark:bg-blue-500': browse === 'features-guides',
              'bg-amber-100 dark:bg-amber-400': browse?.[0] === 'hotel-reviews',
              'text-white bg-green-600': browse?.[0] === 'motorbike-guides',
              'text-white bg-yellow-900': browse?.[0] === 'destinations',
              'bg-yellow-200': browse?.[0] === 'food-and-drink',
            },
          )}>
          <h3 className="text-xl md:text-2xl">{data.title}</h3>
          <p className="max-w-4xl mt-4 mb-6 sm:px-16 mx-auto text-sm leading-snug md:text-base font-serif dark:text-white/50">
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
            <ExternalLinkIcon className="ml-2 w-4 h-4" />
          </a>
        </div>
        <div className="relative">
          <div className="overflow-hidden">
            <div className="h-[75vh] mb-[-14px] min-h-[850px]">
              <iframe
                className="absolute inset-0 w-full h-full"
                height="650"
                src={`https://www.google.com/maps/d/embed?mid=${data.mid}&z=6&hl=en`}
                title={data.title}
                width="800"></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
