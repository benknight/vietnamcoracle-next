import { graphql, useStaticQuery } from 'gatsby';
import Image from 'gatsby-image';
import React from 'react';

export default function Header() {
  const data = useStaticQuery(graphql`
    {
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
    }
  `);
  return (
    <header className="mt-6 mb-10 px-3 text-center">
      <Image className="rounded-full" fixed={data.logo.childImageSharp.fixed} />
      <h1 className="text-4xl lg:text-5xl text-gray-800 font-display antialiased">
        {data.site.siteMetadata.title}
      </h1>
      <h2 className="text-gray-600 text-xxs sm:text-xs uppercase tracking-widest font-serif">
        {data.site.siteMetadata.description}
      </h2>
    </header>
  );
}
