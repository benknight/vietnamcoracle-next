import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';
import Block from './Block';

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
      <h3 className="text-xl sm:text-2xl mb-3">{block.title}</h3>
      <p className="mx-auto mb-8 px-12 sm:px-16 text-sm sm:text-base max-w-lg font-sans">
        {block.description}{' '}
      </p>
    </Block>
  );
}
