import React from 'react';
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
      <a href={block.link.url}>
        <img
          alt=""
          className="w-48 mx-auto"
          srcSet={block.image.srcSet}
          title={block.link.title}
        />
      </a>
    </Block>
  );
}
