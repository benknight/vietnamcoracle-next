import cx from 'classnames';
import { graphql, useStaticQuery, Link } from 'gatsby';
import Image from 'gatsby-image';
import Tooltip from '@material-ui/core/Tooltip';
import FacebookIcon from '@material-ui/icons/Facebook';
import SearchIcon from '@material-ui/icons/Search';
import TwitterIcon from '@material-ui/icons/Twitter';
import YouTubeIcon from '@material-ui/icons/YouTube';
import React from 'react';

export default function Header() {
  const ref = React.useRef();
  const [showMini, setShowMini] = React.useState(false);
  const data = useStaticQuery(graphql`
    {
      logoLg: file(relativePath: { eq: "logo.jpg" }) {
        childImageSharp {
          fixed(width: 120, height: 120, cropFocus: CENTER) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      logoSm: file(relativePath: { eq: "logo.jpg" }) {
        childImageSharp {
          fixed(width: 42, height: 42, cropFocus: CENTER, fit: COVER) {
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
  React.useEffect(() => {
    const onScroll = event =>
      setShowMini(window.scrollY >= ref.current.getBoundingClientRect().height);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header className="pt-8 pb-10 px-3 text-center" ref={ref}>
      <Link className="inline-flex" to="/">
        <Image
          className="rounded-full"
          fixed={data.logoLg.childImageSharp.fixed}
        />
      </Link>
      <h1 className="text-4xl text-gray-800 dark:text-gray-200 font-display antialiased">
        {data.site.siteMetadata.title}
      </h1>
      <h2 className="text-gray-600 text-xxs sm:text-xs uppercase tracking-widest font-serif">
        {data.site.siteMetadata.description}
      </h2>
      <div className="fixed top-0 left-0 z-30 w-full">
        <div
          className={cx(
            'absolute top-0 left-0',
            'flex items-center h-16 px-4',
            'bg-white dark:bg-gray-900',
            'transform transition-transform duration-200',
            { '-translate-x-16': !showMini },
          )}>
          <Link className="inline-flex mr-4" to="/">
            <Image
              className="rounded-full"
              fixed={data.logoSm.childImageSharp.fixed}
            />
          </Link>
          <div className="relative">
            <div className="absolute top-0 left-0 bottom-0 flex items-center px-3 pointer-events-none">
              <SearchIcon classes={{ root: 'w-6 h-6' }} />
            </div>
            <input
              className="h-10 pl-10 w-40 focus:w-64 pr-3 border dark:bg-black dark:bg-opacity-25 dark:border-gray-800 rounded-full outline-none dark:focus:border-gray-600"
              type="search"
            />
          </div>
        </div>
        <div className="absolute top-0 right-0 flex items-center h-16 px-4 bg-white dark:bg-gray-900 text-gray-400">
          <a href="https://www.facebook.com/vietnamcoracle">
            <Tooltip
              title="Facebook"
              aria-label="Vietnam Coracle on Facebook"
              arrow>
              <FacebookIcon classes={{ root: 'w-10 h-10' }} />
            </Tooltip>
          </a>
          <a className="ml-2" href="https://www.facebook.com/vietnamcoracle">
            <Tooltip
              title="Twitter"
              aria-label="Vietnam Coracle on Twitter"
              arrow>
              <TwitterIcon classes={{ root: 'w-10 h-10' }} />
            </Tooltip>
          </a>
          <a className="ml-2" href="https://www.facebook.com/vietnamcoracle">
            <Tooltip
              title="YouTube"
              aria-label="Vietnam Coracle on YouTube"
              arrow>
              <YouTubeIcon classes={{ root: 'w-10 h-10' }} />
            </Tooltip>
          </a>
        </div>
      </div>
    </header>
  );
}
