import cx from 'classnames';
import { graphql } from 'gatsby';
import Image from 'gatsby-image';
import React from 'react';
import LaunchIcon from '@material-ui/icons/Launch';
import SearchIcon from '@material-ui/icons/SearchRounded';
import gMapsLogo from '../assets/google-maps-logo.svg';
import Carousel, { CarouselSlide } from '../components/Carousel';

const Index = ({ data }) => {
  return (
    <div className="pb-8 max-w-4xl mx-auto shadow-lg">
      <nav className="h-16 px-4 flex items-center justify-end">
        <SearchIcon className="text-gray-700" />
      </nav>
      <header className="mb-8 p-3 text-center">
        <Image
          className="rounded-full"
          fixed={data.logo.childImageSharp.fixed}
        />
        <h1 className="text-4xl lg:text-5xl text-gray-800 font-display antialiased">
          {data.site.siteMetadata.title}
        </h1>
        <h2 className="text-gray-600 text-xxs sm:text-xs uppercase tracking-widest font-serif">
          {data.site.siteMetadata.description}
        </h2>
      </header>
      <Carousel className="mb-8">
        {data.wpPage.home.slides.map(slide => (
          <CarouselSlide
            className="block relative w-full flex-shrink-0"
            component="a"
            href={slide.link.url}
            key={slide.link.url}>
            <img alt={slide.link.title} srcSet={slide.image.srcSet} />
            <div
              className={cx(
                'w-full h-full pb-8 absolute top-0 left-0 flex',
                getClassNameFromSlidePosition(slide.position),
              )}>
              <div
                className="slider-text flex-auto font-serif p-4 leading-none text-3xl sm:text-4xl md:text-5xl"
                dangerouslySetInnerHTML={{ __html: slide.words }}
              />
            </div>
          </CarouselSlide>
        ))}
      </Carousel>
      {data.wpPage.home.collections.map(collection => (
        <section className="my-2 md:my-8" key={collection.heading}>
          <h3 className="px-4 lg:px-8 text-lg sm:text-xl md:text-2xl lg:text-3xl font-display">
            {collection.heading}
          </h3>
          <ol className="flex py-2 overflow-x-auto">
            {collection.posts.map((post, index) => (
              <li
                className={cx('px-1 flex flex-shrink-0', {
                  'pr-4 lg:pr-8': index === collection.posts.length - 1,
                  'pl-4 lg:pl-8': index === 0,
                })}
                title={post.slug}
                key={post.slug}>
                <a
                  className="
                    relative overflow-hidden
                    flex flex-col w-32 sm:w-40 md:w-48 lg:w-56
                    rounded md:rounded-lg shadow"
                  href={`https://www.vietnamcoracle.com${post.link}`}>
                  <img
                    alt={post.thumbnails.thumbnailSquare.altText}
                    className="absolute block w-full h-full object-cover"
                    loading="lazy"
                    sizes={post.thumbnails.thumbnailSquare.sizes}
                    srcSet={post.thumbnails.thumbnailSquare.srcSet}
                  />
                  <img
                    alt={post.thumbnails.thumbnailSquare.altText}
                    className="relative block w-full h-24 sm:h-32 md:h-40 lg:h-48 object-cover"
                    loading="lazy"
                    sizes={post.thumbnails.thumbnailSquare.sizes}
                    srcSet={post.thumbnails.thumbnailSquare.srcSet}
                  />
                  <div
                    className="
                      backdrop-blur relative
                      p-2 sm:p-3 flex-auto flex items-center
                      text-white font-medium rounded-b md:rounded-b-lg">
                    <h3
                      className={cx('sm:text-sm leading-tight font-serif', {
                        'text-xs sm:text-sm md:text-base lg:text-lg':
                          post.title.length > 40,
                        'text-sm sm:text-base md:text-lg lg:text-xl':
                          post.title.length <= 40,
                      })}>
                      {post.title}
                    </h3>
                  </div>
                </a>
              </li>
            ))}
          </ol>
        </section>
      ))}
      <section className="mt-8 mb-12">
        <div
          className="relative p-8 bg-blue-100 text-center font-display"
          style={{ marginBottom: '-55px' }}>
          <h3 className="text-3xl">{data.wpPage.home.map.title}</h3>
          <p className="mt-2 mb-4 sm:px-16">
            {data.wpPage.home.map.description}
          </p>
          <a
            className="px-3 py-1 inline-flex items-center text-blue-700 border border-blue-200 rounded-full font-sans"
            href="https://www.google.com/maps/d/viewer?mid=1cw-7FsXjX9By_cSgIvNgMw-hGdRpHei3">
            <img alt="" className="block w-8 h-8 mr-1" src={gMapsLogo} />
            Open in Google Maps
            <LaunchIcon className="ml-2" />
          </a>
        </div>
        <iframe
          height="600"
          src="https://www.google.com/maps/d/u/0/embed?mid=1cw-7FsXjX9By_cSgIvNgMw-hGdRpHei3"
          title="The Vietnam Coracle Map"
          width="100%"></iframe>
      </section>
      <section className="mb-12 text-center font-display">
        <a
          className="block w-48 h-48 mx-auto my-8"
          href={data.wpPage.home.about.link.url}>
          <img
            alt=""
            className="h-full rounded-full object-cover"
            srcSet={data.wpPage.home.about.image.srcSet}
          />
        </a>
        <h3 className="text-xl mb-3">{data.wpPage.home.about.title}</h3>
        <p className="mx-auto px-12 sm:px-16 text-sm sm:text-base max-w-lg">
          {data.wpPage.home.about.description}{' '}
          <a className="link" href={data.wpPage.home.about.link.url}>
            Read more ›
          </a>
        </p>
      </section>
      <section className="mb-20 text-center font-display">
        <h3 className="text-xl mb-3">{data.wpPage.home.support.title}</h3>
        <p className="mx-auto mb-8 px-12 sm:px-16 text-sm sm:text-base max-w-lg">
          {data.wpPage.home.support.description}{' '}
          <a className="link" href={data.wpPage.home.support.link.url}>
            Read more ›
          </a>
        </p>
        <a href={data.wpPage.home.support.link.url}>
          <img
            alt=""
            className="w-56 mx-auto"
            srcSet={data.wpPage.home.support.button.srcSet}
            title={data.wpPage.home.support.link.title}
          />
        </a>
      </section>
      <section className="mb-12 text-center font-display">
        <div
          className="block w-24 h-24 mx-auto mb-4"
          href={data.wpPage.home.about.link.url}>
          <img
            alt=""
            className="h-full rounded-full object-cover"
            srcSet={data.wpPage.home.subscribe.image.srcSet}
          />
        </div>
        <h3 className="text-xl mb-3">{data.wpPage.home.subscribe.title}</h3>
        <p className="mx-auto mb-8 px-12 sm:px-16 text-sm sm:text-base max-w-lg">
          {data.wpPage.home.subscribe.description}{' '}
        </p>
      </section>
    </div>
  );
};

function getClassNameFromSlidePosition(position) {
  const [align, justify] = position.split('-');
  return `items-${align} justify-${justify}`
    .split('top')
    .join('start')
    .split('bottom')
    .join('end');
}

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
    wpPage(slug: { eq: "home" }) {
      home {
        slides {
          link {
            title
            url
          }
          image {
            id
            srcSet
          }
          words
          position
        }
        collections {
          heading
          posts {
            ... on WpPost {
              link
              slug
              title
              thumbnails {
                thumbnailSquare {
                  altText
                  srcSet
                  sizes
                }
              }
            }
          }
        }
        map {
          description
          title
        }
        about {
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
        support {
          description
          title
          button {
            srcSet
          }
          link {
            title
            url
          }
        }
        subscribe {
          button
          description
          title
          image {
            srcSet
          }
        }
      }
    }
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
`;

export default Index;
