import Image from 'next/image';
import Link from 'next/link';
import internalizeUrl from '../lib/internalizeUrl';
import Block, { BlockContent, BlockTitle, BlockType } from './Block';

interface Props {
  data: BlockType;
}

const btnClassName =
  'flex items-center justify-center h-10 mt-2 border bg-gray-100 dark:bg-opacity-10 dark:hover:bg-opacity-50 dark:text-white hover:text-white rounded-full transition duration-100 ease-in-out transform hover:scale-105';

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
        <a
          className={`${btnClassName} bg-[#FF424D] !border-[#FF424D] text-white dark:hover:bg-opacity-100`}
          href="https://www.patreon.com/vietnamcoracle"
          target="_blank">
          <img
            alt=""
            className="w-5 h-5 mr-2"
            src="/Digital-Patreon-Logo_White.png"
          />
          Become a Patron
        </a>
        <Link href="/donations-page">
          <a
            className={`${btnClassName} border-white dark:border-black hover:bg-purple-400`}>
            Donate
          </a>
        </Link>
        <div className="flex text-xs">
          <Link href="/book-your-accommodation">
            <a
              className={`${btnClassName} flex-auto border-white dark:border-black hover:bg-blue-400`}>
              Book Hotels
            </a>
          </Link>
          <Link href="/book-your-transportation">
            <a
              className={`${btnClassName} ml-1 flex-auto border-white dark:border-black hover:bg-green-400`}>
              Book Transportation
            </a>
          </Link>
        </div>
      </div>
    </Block>
  );
}
