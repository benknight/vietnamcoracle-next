import Block, { BlockContent, BlockTitle } from './Block';

export default function About({ data: block }) {
  return (
    <Block>
      <a className="block w-40 h-40 mx-auto my-6" href={block.link.url}>
        <img
          alt=""
          className="h-full rounded-full object-cover"
          srcSet={block.image.srcSet}
        />
      </a>
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
