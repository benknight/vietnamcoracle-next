import { graphql, useStaticQuery, Link } from 'gatsby';
import React from 'react';

export default function Browse() {
  const {
    data: { nav },
  } = useStaticQuery(graphql`
    {
      data: wpComponent(slug: { eq: "category-nav" }) {
        nav {
          links {
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
  return (
    <nav>
      <ul className="grid gap-4 lg:gap-5 sm:grid-cols-2">
        {nav.links.map(({ link, image }) => (
          <li
            className="relative overflow-hidden rounded md:rounded-lg"
            key={link.url}>
            <img
              alt=""
              className="block w-full h-32 object-cover"
              srcSet={image.srcSet}
            />
            <Link
              className="
                browse-link text-shadow-md
                flex items-center justify-center
                absolute top-0 left-0 w-full h-full
                text-white text-2xl lg:text-3xl text-center font-medium font-serif
                bg-gradient-to-t from-black-75 via-transparent"
              to={link.url}>
              {link.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
