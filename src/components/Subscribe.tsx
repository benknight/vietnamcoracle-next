import Image from 'next/image';
import Block, { BlockContent, BlockTitle, BlockType } from './Block';

interface Props {
  data: BlockType;
}

export default function Subscribe({ data: block }: Props) {
  return (
    <Block>
      <div className="flex justify-center mb-4">
        <a href={block.link.url}>
          <Image
            alt=""
            className="h-full rounded-full object-cover"
            height="96"
            layout="fixed"
            src={block.image.sourceUrl}
            width="96"
          />
        </a>
      </div>
      <BlockTitle>{block.title}</BlockTitle>
      <BlockContent>
        <p>{block.description}</p>
        <form className="flex justify-center max-w-xs mt-4 mx-auto">
          <input
            className="form-field flex-auto h-8 mr-2 p-2 text-sm rounded"
            type="email"
          />
          <button className="btn" type="submit">
            Subscribe
          </button>
        </form>
      </BlockContent>
    </Block>
  );
}
