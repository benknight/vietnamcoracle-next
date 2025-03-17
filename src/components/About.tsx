import Image from 'next/legacy/image';
import Link from 'next/link';
import internalizeUrl from '../lib/internalizeUrl';
import Block, { BlockContent, BlockTitle, BlockType } from './Block';

interface Props {
  data: BlockType;
}

export default function About({ data: block }: Props) {
  return (
    <Block>
      <div className="mb-6 flex justify-center">
        <Link href={internalizeUrl(block.link.url)}>
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
      <BlockContent className="xl:max-w-[300px]">
        <p>
          {block.description}{' '}
          <Link
            href={internalizeUrl(block.link.url)}
            className="link whitespace-nowrap">
            {block.link.title}
          </Link>
        </p>
      </BlockContent>
    </Block>
  );
}
