import Image from 'next/image';
import Block, { BlockContent, BlockTitle } from './Block';

export default function About({ data: block }) {
  return (
    <Block>
      <div className="my-6 flex justify-center">
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
          <a className="link" href={block.link.url}>
            {block.link.title}
          </a>
        </p>
      </BlockContent>
    </Block>
  );
}
