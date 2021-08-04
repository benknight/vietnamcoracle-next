import Image from 'next/image';
import Link from 'next/link';
import internalizeUrl from '../lib/internalizeUrl';
import Block, { BlockContent, BlockTitle, BlockType } from './Block';

interface Props {
  data: BlockType;
}

export default function About({ data: block }: Props) {
  return (
    <Block>
      <div className="mt-4 mb-6 flex justify-center">
        <Link href={internalizeUrl(block.link.url)}>
          <a>
            <Image
              alt=""
              className="h-full rounded-full object-cover"
              height="160"
              layout="fixed"
              src={block.image.sourceUrl}
              width="160"
            />
          </a>
        </Link>
      </div>
      <BlockTitle>{block.title}</BlockTitle>
      <BlockContent className="xl:max-w-[350px]">
        <p>
          {block.description}{' '}
          <Link href={internalizeUrl(block.link.url)}>
            <a className="link">{block.link.title}</a>
          </Link>
        </p>
      </BlockContent>
    </Block>
  );
}
