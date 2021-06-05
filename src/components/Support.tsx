import Image from 'next/image';
import Link from 'next/link';
import internalizeUrl from '../lib/internalizeUrl';
import Block, { BlockContent, BlockTitle, BlockType } from './Block';

interface Props {
  data: BlockType;
}

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
      <div className="flex justify-center">
        <a href="https://patreon.com/vietnamcoracle">
          <Image
            alt=""
            layout="fixed"
            width="170"
            height="40"
            src={block.image.sourceUrl}
            title={block.link.title}
          />
        </a>
      </div>
    </Block>
  );
}
