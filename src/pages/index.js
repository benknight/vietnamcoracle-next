import { graphql } from 'gatsby';
import Image from 'gatsby-image';
import React from 'react';
import SearchIcon from '@material-ui/icons/SearchRounded';

export default ({ data }) => (
  <>
    <nav className="h-16 px-4 flex items-center justify-end">
      <SearchIcon className="text-gray-700" />
    </nav>
    <header className="p-3 text-center">
      <Image className="rounded-full" fixed={data.logo.childImageSharp.fixed} />
      <h1 className="text-4xl text-gray-800 font-display antialiased">
        {data.site.siteMetadata.title}
      </h1>
      <h2
        className="text-gray-600 uppercase tracking-widest"
        style={{ fontSize: '10px' }}>
        {data.site.siteMetadata.description}
      </h2>
    </header>
  </>
);

export const query = graphql`
  query {
    logo: file(relativePath: { eq: "logo.jpg" }) {
      childImageSharp {
        fixed(width: 100, height: 100) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    site {
      siteMetadata {
        title
        description
      }
    }
    wpContent {
      page(id: "home", idType: URI) {
        homeSettings {
          collections {
            heading
            posts {
              ... on WPGraphQL_Post {
                title
                link
              }
            }
          }
        }
      }
    }
  }
`;
