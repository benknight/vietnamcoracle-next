import Image from 'next/legacy/image';
import Link from 'next/link';
import internalizeUrl from '../lib/internalizeUrl';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import Block, { BlockContent, BlockData, BlockTitle } from './Block';

interface Props {
  data: BlockData;
}

const btnClassName = 'btn flex mt-2';

export default function About({ data: block }: Props) {
  return (
    <Block>
      <div className="mb-6 flex justify-center">
        <Link href={internalizeUrl('/about/')}>
          <Image
            alt=""
            className="h-full rounded-full object-cover"
            height="140"
            layout="fixed"
            src={block.image.sourceUrl}
            width="140"
          />
        </Link>
      </div>
      <BlockTitle>{block.title}</BlockTitle>
      <BlockContent className="xl:max-w-[350px]">
        <p>
          {block.description}{' '}
          <Link
            href={internalizeUrl('/support/')}
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
            className="dark:invert"
            src="/patreon-symbol.svg"
            width={16}
            height={16}
          />
          Become a Patron
        </Link>
      </div>
    </Block>
  );
}
