import cx from 'classnames';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';
import {
  BlockContent,
  BlockData,
  BlockTitle,
} from '../../../../components/Block';
import MapOverlay from '../../../../components/MapOverlay';

interface Props {
  mapBlock: BlockData;
  navCategory?: string;
  aboutBlock: BlockData;
  supportBlock: BlockData;
}

const CategoryMap = ({
  aboutBlock,
  mapBlock,
  navCategory,
  supportBlock,
}: Props) => {
  return (
    <div id="map">
      <div className="lg:rounded-lg overflow-hidden">
        <div
          className={cx(
            'relative pt-8 pb-2 md:pt-10 text-center dark:text-white lg:rounded-t-lg font-display',
            {
              'bg-blue-100 dark:bg-blue-500/10': !navCategory,
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
          <BlockTitle>{mapBlock.title}</BlockTitle>
          <BlockContent>
            {mapBlock.description}{' '}
            <div className="mt-3">
              <a
                className="link inline-flex items-center hover:underline"
                href={`https://www.google.com/maps/d/viewer?mid=${mapBlock.mid}`}>
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
          src={`https://www.google.com/maps/d/embed?mid=${mapBlock.mid}&z=6&hl=en&ehbc=57534e`}
          title={mapBlock.title}
          width={800}
          blockDescription={supportBlock.description}
          blockImage={aboutBlock.image.sourceUrl}
          blockTitle={supportBlock.title}
        />
      </div>
    </div>
  );
};

export default CategoryMap;
