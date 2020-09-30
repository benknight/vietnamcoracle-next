import cx from 'classnames';
import { graphql, useStaticQuery, Link } from 'gatsby';
import Image from 'gatsby-image';
import React from 'react';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/SearchRounded';

export default function Nav() {
  const data = useStaticQuery(graphql`
    {
      logo: file(relativePath: { eq: "logo.jpg" }) {
        childImageSharp {
          fixed(width: 48, height: 48) {
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
      nav: wpComponent(slug: { eq: "category-nav" }) {
        nav {
          links {
            link {
              title
              url
            }
          }
        }
      }
    }
  `);
  const [isScrolled, setIsScolled] = React.useState(false);
  React.useEffect(() => {
    const listener = () => {
      if (window.scrollY > 0) {
        setIsScolled(true);
      } else {
        setIsScolled(false);
      }
    };
    window.addEventListener('scroll', listener);
    return () => window.removeEventListener('scroll', listener);
  }, []);
  return (
    <nav
      className={cx(
        'nav fixed top-0 z-10',
        'w-full h-16 px-3 flex items-center',
        'text-gray-700 md:text-white md:bg-gradient-to-b from-black-25 dark:from-black-75',
        {
          'md:backdrop-blur bg-gradient-to-b': isScrolled,
        },
      )}>
      <div className="hidden flex-auto md:flex items-center">
        <div className="h-16 inline-flex items-center pl-4 pr-4">
          <Image
            className="rounded-full"
            fixed={data.logo.childImageSharp.fixed}
          />
        </div>
        <Link activeClassName="font-bold" className="mx-3 text-sm" to="/">
          Home
        </Link>
        {data.nav.nav.links.map(item => (
          <Link
            activeClassName="font-bold"
            className="mx-3 text-sm"
            to={item.link.url}>
            {item.link.title}
          </Link>
        ))}
      </div>
      <div className="md:hidden flex-auto flex items-center">
        <div
          className={cx('h-12 inline-flex items-center px-4 rounded-full', {
            'bg-white dark:bg-white shadow': isScrolled,
          })}>
          <MenuIcon />
          <div className="flex-auto">
            <button className="pl-4 inline-flex text-sm">
              Browse by category <ArrowDropDownIcon />
            </button>
          </div>
        </div>
      </div>
      <div
        className={cx(
          'w-12 h-12 inline-flex items-center justify-center rounded-full',
          {
            'bg-white shadow md:bg-transparent md:shadow-none': isScrolled,
          },
        )}>
        <SearchIcon />
      </div>
    </nav>
  );
}
