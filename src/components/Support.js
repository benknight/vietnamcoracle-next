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
      <a className="block w-48 mx-auto" href={block.link.url}>
        <img
          alt=""
          className="w-full"
          srcSet={block.image.srcSet}
          title={block.link.title}
        />
      </a>
    </Block>
  );
}
