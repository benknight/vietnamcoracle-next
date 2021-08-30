import Link from 'next/link';
import internalizeUrl from '../lib/internalizeUrl';
import { CurrencyDollarIcon } from '@heroicons/react/outline';
import HeartIcon from '@material-ui/icons/Favorite';
import HeartOutlineIcon from '@material-ui/icons/FavoriteBorder';
import FlightIcon from '@material-ui/icons/Flight';
import HotelIcon from '@material-ui/icons/Hotel';
import Block, { BlockContent, BlockTitle, BlockType } from './Block';

interface Props {
  data: BlockType;
}

const btnClassName =
  'flex items-center justify-center mt-2 border bg-gray-100 dark:bg-opacity-10 hover:bg-opacity-25 dark:hover:bg-opacity-33 dark:text-white rounded-xl transition-colors duration-100 ease-in-out';

export default function Support({ data: block }: Props) {
  return (
    <Block className="group">
      <div className="flex justify-center -mt-6 mb-6">
        <Link href="/donations-page">
          <a className="relative top-1 !w-14 !h-14 text-red-500">
            <HeartIcon className="!w-full !h-full absolute inset-0 xl:!hidden xl:group-hover:!block animate-ping opacity-60" />
            <HeartIcon className="!w-full !h-full absolute inset-0 dark:!hidden" />
            <HeartOutlineIcon className="!w-full !h-full absolute inset-0 !hidden dark:!block" />
          </a>
        </Link>
      </div>
      <BlockTitle>{block.title}</BlockTitle>
      <BlockContent className="xl:max-w-[340px]">
        <p>
          {block.description}{' '}
          <Link href={internalizeUrl(block.link.url)}>
            <a className="link whitespace-nowrap">Read more ›</a>
          </Link>
        </p>
      </BlockContent>
      <div className="max-w-xs mx-auto tracking-wider font-sans font-medium">
        <Link href="/donations-page">
          <a
            className={`${btnClassName} bg-primary-500 hover:bg-primary-400 border-primary-500 hover:border-primary-400 dark:border-opacity-50 hover:bg-opacity-100 text-white h-12`}>
            <CurrencyDollarIcon className="w-6 h-6 mr-1" />{' '}
            <span className="pr-4">Donate</span>
          </a>
        </Link>
        <Link href="/become-a-patron-of-vietnam-coracle">
          <a
            className={`${btnClassName} border-white dark:border-black hover:bg-[#FF424D] h-12`}>
            <img
              alt=""
              className="w-4 h-4 mr-2"
              src="/Digital-Patreon-Logo_FieryCoral.png"
            />
            Become a Patron
          </a>
        </Link>
        <div className="flex text-xs">
          <Link href="/book-your-accommodation">
            <a
              className={`${btnClassName} border-white dark:border-black flex-auto hover:bg-blue-400 h-10`}>
              <HotelIcon className="!w-4 !h-4 mr-2" /> Book Hotels
            </a>
          </Link>
          <Link href="/book-your-transportation">
            <a
              className={`${btnClassName} border-white dark:border-black ml-1 flex-auto hover:bg-green-400 h-10`}>
              <FlightIcon className="!w-4 !h-4 mr-1" /> Book Transport
            </a>
          </Link>
        </div>
      </div>
    </Block>
  );
}
