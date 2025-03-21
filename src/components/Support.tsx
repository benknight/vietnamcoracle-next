import Link from 'next/link';
import internalizeUrl from '../lib/internalizeUrl';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import FlightIcon from '@mui/icons-material/Flight';
import HotelIcon from '@mui/icons-material/Hotel';
import Block, { BlockContent, BlockTitle, BlockData } from './Block';
import HeartIcon from './HeartIcon';
import Image from 'next/legacy/image';

interface Props {
  data: BlockData;
}

const btnClassName = 'btn flex mt-2';

export default function Support({ data: block }: Props) {
  return (
    <Block className="group">
      <div className="flex justify-center mb-6">
        <Link
          href="/donations-page"
          className="relative top-1 !w-14 !h-14 text-red-500">
          <HeartIcon className="!w-full !h-full absolute inset-0" />
          <HeartIcon className="!w-full !h-full absolute inset-0 xl:!hidden xl:group-hover:!block animate-ping opacity-60" />
        </Link>
      </div>
      <BlockTitle>{block.title}</BlockTitle>
      <BlockContent className="xl:max-w-[350px]">
        <p>
          {block.description}{' '}
          <Link
            href={internalizeUrl(block.link.url)}
            className="link whitespace-nowrap">
            Read more ›
          </Link>
        </p>
      </BlockContent>
      <div className="max-w-xs mx-auto">
        <Link
          href="/donations-page"
          className={`${btnClassName} btn-primary h-12`}>
          <CurrencyDollarIcon className="w-6 h-6 mr-1" />{' '}
          <span className="pr-4">Donate</span>
        </Link>
        <Link
          href="https://www.patreon.com/vietnamcoracle"
          className={`${btnClassName} gap-2 btn-patreon border-white dark:border-black h-12`}>
          <Image
            alt=""
            src="/Digital-Patreon-Logo_FieryCoral.png"
            width={16}
            height={16}
          />
          Become a Patron
        </Link>
        <div className="flex text-xs">
          <Link
            href="/book-your-accommodation"
            className={`${btnClassName} border-white dark:border-black flex-auto hover:bg-blue-400 hover:bg-opacity-25 h-10`}>
            <HotelIcon className="!w-[14px] !h-[14px] mr-2" />
            Book Hotels
          </Link>
          <Link
            href="/book-your-transportation"
            className={`${btnClassName} border-white dark:border-black ml-1 flex-auto hover:bg-green-400 hover:bg-opacity-25 h-10`}>
            <FlightIcon className="!w-[14px] !h-[14px] mr-2" />
            Book Transport
          </Link>
        </div>
      </div>
    </Block>
  );
}
