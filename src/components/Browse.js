import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';

export default function Browse() {
  const data = useStaticQuery(graphql`
    {
      allWpCategory(
        filter: {
          slug: {
            in: [
              "motorbike-guides"
              "destinations"
              "hotel-reviews"
              "food-and-drink"
            ]
          }
        }
      ) {
        nodes {
          name
          wpChildren {
            nodes {
              name
              posts {
                nodes {
                  title
                  link
                }
              }
            }
          }
        }
      }
    }
  `);
  return <div />;
}
