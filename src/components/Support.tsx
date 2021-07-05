import Link from 'next/link';
import internalizeUrl from '../lib/internalizeUrl';
import { CurrencyPoundIcon } from '@heroicons/react/solid';
import Block, { BlockContent, BlockTitle, BlockType } from './Block';

interface Props {
  data: BlockType;
}

const btnClassName =
  'flex items-center justify-center mt-2 border bg-gray-100 dark:bg-opacity-10 hover:bg-opacity-25 dark:hover:bg-opacity-33 dark:text-white rounded-xl transition-colors duration-100 ease-in-out';

export default function Support({ data: block }: Props) {
  return (
    <Block>
      <BlockTitle>{block.title}</BlockTitle>
      <BlockContent>
        <p>
          {block.description}{' '}
          <Link href={internalizeUrl(block.link.url)}>
            <a className="link whitespace-nowrap">Read more ›</a>
          </Link>
        </p>
      </BlockContent>
      <div className="max-w-xs mx-auto text-sm tracking-wider">
        <Link href="/donations-page">
          <a
            className={`${btnClassName} border-white dark:border-blue-400 dark:border-opacity-50 bg-blue-400 hover:bg-opacity-100 dark:hover:bg-opacity-75 text-white h-12`}>
            <CurrencyPoundIcon className="w-5 h-5 mr-1" />{' '}
            <span className="pr-4">Donate</span>
          </a>
        </Link>
        <a
          className={`${btnClassName} border-white dark:border-black hover:bg-[#FF424D] h-10`}
          href="https://www.patreon.com/vietnamcoracle"
          target="_blank">
          <img
            alt=""
            className="w-4 h-4 mr-2"
            src="/Digital-Patreon-Logo_FieryCoral.png"
          />
          Become a Patron
        </a>
        <div className="flex text-xs">
          <Link href="/book-your-accommodation">
            <a
              className={`${btnClassName} border-white dark:border-black flex-auto hover:bg-purple-400 h-10`}>
              Book Hotels
            </a>
          </Link>
          <Link href="/book-your-transportation">
            <a
              className={`${btnClassName} border-white dark:border-black ml-1 flex-auto hover:bg-green-400 h-10`}>
              Book Transportation
            </a>
          </Link>
        </div>
      </div>
    </Block>
  );
}
