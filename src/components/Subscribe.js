import Block, { BlockContent, BlockTitle } from './Block';

export default function Subscribe({ data: block }) {
  return (
    <Block>
      <div className="block w-24 h-24 mx-auto mb-4" href={block.link.url}>
        <img
          alt=""
          className="h-full rounded-full object-cover"
          srcSet={block.image.srcSet}
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
