import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';
import Block from './Block;';

export default function About() {
  const {
    about: { block: data },
  } = useStaticQuery(graphql`
    {
      support: wpComponent(slug: { eq: "support" }) {
        block {
          ...BlockComponentData
        }
      }
    }
  `);
  return (
    <Block>
      <h3 className="text-xl sm:text-2xl mb-3">{block.title}</h3>
      <p className="mx-auto mb-8 px-12 sm:px-16 text-sm sm:text-base max-w-lg font-sans">
        {block.description}{' '}
        <a className="link" href={block.link.url}>
          Read more ›
        </a>
      </p>
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
