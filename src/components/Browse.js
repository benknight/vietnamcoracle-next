import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';

export default function Browse() {
  const data = useStaticQuery(graphql`
    {
      wpComponent(slug: { eq: "nav" }) {
        nav {
          items {
            link {
              title
              url
            }
            image {
              srcSet
            }
          }
        }
      }
    }
  `);
  // TODO
  return <div />;
}
