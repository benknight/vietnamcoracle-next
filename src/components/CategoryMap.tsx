import cx from 'classnames';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';
import useNavCategory from '../lib/useNavCategory';
import { BlockContent, BlockTitle } from './Block';
import MapOverlay from './MapOverlay';

const CategoryMap = ({ data }) => {
  const navCategory = useNavCategory();
  return (
    <div id="map">
      <div className="lg:rounded-lg overflow-hidden">
        <div
          className={cx(
            'relative pt-8 pb-2 md:pt-10 text-center dark:text-white lg:rounded-t-lg font-display',
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
                <ArrowTopRightOnSquareIcon className="ml-1 w-4 h-4" />
              </a>
            </div>
          </BlockContent>
        </div>
        <MapOverlay
          className="h-[80vh] mb-[-14px]"
          iframeClassName="absolute inset-0 w-full h-full"
          height={650}
          src={`https://www.google.com/maps/d/embed?mid=${data.mid}&z=6&hl=en&ehbc=57534e`}
          title={data.title}
          width={800}
        />
      </div>
    </div>
  );
};

export default CategoryMap;
