import Image from 'next/image';
import Link from 'next/link';
import Block, { BlockContent, BlockTitle, BlockType } from './Block';

interface Props {
  data: BlockType;
}

export default function About({ data: block }: Props) {
  return (
    <Block>
      <div className="mt-4 mb-6 flex justify-center">
        <a href={block.link.url}>
          <Image
            alt=""
            className="h-full rounded-full object-cover"
            height="160"
            layout="fixed"
            src={block.image.sourceUrl}
            width="160"
          />
        </a>
      </div>
      <BlockTitle>{block.title}</BlockTitle>
      <BlockContent>
        <p>
          {block.description}{' '}
          <Link href={'/about-2'}>
            <a className="link">{block.link.title}</a>
          </Link>
        </p>
      </BlockContent>
    </Block>
  );
}
