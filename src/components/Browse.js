import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';

export default function Browse({ data }) {
  const data = useStaticQuery(graphql`
    {
      wpComponent(slug: { eq: "nav" }) {
        nav {
          items {
            link {
              text
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
  return <div />;
}
