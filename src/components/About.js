import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';
import Block from './Block';

export default function About() {
  const {
    about: { block },
  } = useStaticQuery(graphql`
    {
      about: wpComponent(slug: { eq: "about" }) {
        block {
          ...BlockComponentData
        }
      }
    }
  `);
  return (
    <Block>
      <a className="block w-48 h-48 mx-auto my-8" href={block.link.url}>
        <img
          alt=""
          className="h-full rounded-full object-cover"
          srcSet={block.image.srcSet}
        />
      </a>
      <h3 className="text-xl sm:text-2xl mb-3">{block.title}</h3>
      <p className="mx-auto px-12 sm:px-16 text-sm sm:text-base max-w-lg font-sans">
        {block.description}{' '}
        <a className="link" href={block.link.url}>
          {block.link.title}
        </a>
      </p>
    </Block>
  );
}
