import Link from 'next/link';
import internalizeUrl from '../lib/internalizeUrl';
import { CurrencyDollarIcon } from '@heroicons/react/outline';
import FlightIcon from '@material-ui/icons/Flight';
import HotelIcon from '@material-ui/icons/Hotel';
import Block, { BlockContent, BlockTitle, BlockType } from './Block';
import HeartIcon from './HeartIcon';

interface Props {
  data: BlockType;
}

const btnClassName = 'btn flex mt-2 rounded-xl';

export default function Support({ data: block }: Props) {
  return (
    <Block className="group">
      <div className="flex justify-center mb-6">
        <Link href="/donations-page">
          <a className="relative top-1 !w-14 !h-14 text-red-500">
            <HeartIcon className="!w-full !h-full absolute inset-0" />
            <HeartIcon className="!w-full !h-full absolute inset-0 xl:!hidden xl:group-hover:!block animate-ping opacity-60" />
          </a>
        </Link>
      </div>
      <BlockTitle>{block.title}</BlockTitle>
      <BlockContent className="xl:max-w-[350px]">
        <p>
          {block.description}{' '}
          <Link href={internalizeUrl(block.link.url)}>
            <a className="link whitespace-nowrap">Read more ›</a>
          </Link>
        </p>
      </BlockContent>
      <div className="max-w-xs mx-auto">
        <Link href="/donations-page">
          <a
            className={`
              ${btnClassName} text-white h-12
              bg-primary-500 hover:bg-primary-400 hover:bg-opacity-100
              border-primary-500 hover:border-primary-400 dark:border-opacity-50`}>
            <CurrencyDollarIcon className="w-6 h-6 mr-1" />{' '}
            <span className="pr-4">Donate</span>
          </a>
        </Link>
        <Link href="/become-a-patron-of-vietnam-coracle">
          <a
            className={`${btnClassName} btn-patreon border-white dark:border-black h-12`}>
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
              className={`${btnClassName} border-white dark:border-black flex-auto hover:bg-blue-400 hover:bg-opacity-25 h-10`}>
              <HotelIcon className="!w-[14px] !h-[14px] mr-2" /> Book Hotels
            </a>
          </Link>
          <Link href="/book-your-transportation">
            <a
              className={`${btnClassName} border-white dark:border-black ml-1 flex-auto hover:bg-green-400 hover:bg-opacity-25 h-10`}>
              <FlightIcon className="!w-[14px] !h-[14px] mr-2" /> Book Transport
            </a>
          </Link>
        </div>
      </div>
    </Block>
  );
}
