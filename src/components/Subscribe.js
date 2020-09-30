import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';
import Block, { BlockContent, BlockTitle } from './Block';

export default function Subscribe() {
  const {
    subscribe: { block },
  } = useStaticQuery(graphql`
    {
      subscribe: wpComponent(slug: { eq: "subscribe" }) {
        block {
          ...BlockComponentData
        }
      }
    }
  `);
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
        <p>{block.description} </p>
      </BlockContent>
    </Block>
  );
}
