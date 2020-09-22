import { graphql } from 'gatsby';
import React from 'react';

export const query = graphql`
  fragment BlockComponentData on WpComponent {
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
