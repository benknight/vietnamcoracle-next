import Image from 'next/image';
import Block, { BlockContent, BlockTitle } from './Block';

export default function Support({ data: block }) {
  return (
    <Block>
      <BlockTitle>{block.title}</BlockTitle>
      <BlockContent>
        <p>
          {block.description}{' '}
          <a className="link" href={block.link.url}>
            Read more ›
          </a>
        </p>
      </BlockContent>
      <div className="flex justify-center">
        <a href={block.link.url}>
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
