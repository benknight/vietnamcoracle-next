import Image from 'next/image';
import Block, { BlockContent, BlockTitle } from './Block';

export default function Subscribe({ data: block }) {
  return (
    <Block>
      <div className="flex justify-center mb-4" href={block.link.url}>
        <Image
          alt=""
          className="h-full rounded-full object-cover"
          height="96"
          layout="fixed"
          src={block.image.sourceUrl}
          width="96"
        />
      </div>
      <BlockTitle>{block.title}</BlockTitle>
      <BlockContent>
        <p>{block.description}</p>
        <form className="flex justify-center max-w-xs mt-4 mx-auto">
          <input
            className="form-field flex-auto h-8 mr-2 p-2 text-sm rounded"
            type="email"
          />
          <button
            className="h-8 px-4 text-sm text-white bg-blue-500 rounded"
            type="submit">
            Subscribe
          </button>
        </form>
      </BlockContent>
    </Block>
  );
}
