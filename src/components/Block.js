import { graphql } from 'gatsby';
import React from 'react';

export const query = graphql`
  fragment BlockComponentData on WpComponent_Block {
    description
    title
    image {
      srcSet
    }
    link {
      title
      url
    }
  }
`;

export default function Block(props) {
  return <div className="text-center font-display">{props.children}</div>;
}

export function BlockTitle(props) {
  return <h3 className="text-xl lg:text-2xl mb-3">{props.children}</h3>;
}

export function BlockContent(props) {
  return (
    <div className="mx-auto mb-8 px-6 text-sm max-w-sm font-serif">
      {props.children}
    </div>
  );
}
