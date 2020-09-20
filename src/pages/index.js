import { graphql } from 'gatsby';
import Image from 'gatsby-image';
import React from 'react';
import LaunchIcon from '@material-ui/icons/Launch';
import gMapsLogo from '../assets/google-maps-logo.svg';
import Collection from '../components/Collection';
import Colophon from '../components/Colophon';
import Nav from '../components/Nav';
import Slider from '../components/Slider';

const Index = ({ data }) => {
  return (
    <div className="pb-8 max-w-4xl mx-auto shadow-lg">
      <Nav />
      <header className="mt-6 mb-10 px-3 text-center">
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
      <Slider data={data.home.slider} />
      {data.home.collections.items.map(item => (
        <Collection item={item} />
      ))}
      <section className="my-2 md:my-8">
        <h3 className="px-4 lg:px-8 text-lg sm:text-xl md:text-2xl lg:text-3xl font-display">
          Browse by category
        </h3>
      </section>
      <section className="mt-8 mb-12">
        <div
          className="relative p-8 bg-blue-100 text-blue-900 text-center font-display"
          style={{ marginBottom: '-55px' }}>
          <h3 className="text-2xl sm:text-3xl">{data.home.map.title}</h3>
          <p className="mt-2 mb-4 sm:px-16 text-sm sm:text-base font-sans">
            {data.home.map.description}
          </p>
          <a
            className="px-3 py-1 inline-flex items-center text-blue-700 text-sm sm:text-base border border-blue-200 rounded-full font-sans"
            href={`https://www.google.com/maps/d/viewer?mid=${data.home.map.mid}`}>
            <img alt="" className="block w-8 h-8 mr-1" src={gMapsLogo} />
            Open in Google Maps
            <LaunchIcon className="ml-2" />
          </a>
        </div>
        <iframe
          className="shadow"
          height="600"
          src={`https://www.google.com/maps/d/u/0/embed?mid=${data.home.map.mid}`}
          title={data.home.map.title}
          width="100%"></iframe>
      </section>
      <Colophon data={data.home.footer.component.colophon} />
    </div>
  );
};

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
    home: wpComponent(slug: { eq: "home" }) {
      collections {
        items {
          ...CollectionComponentData
        }
      }
      footer {
        component {
          ... on WpComponent {
            colophon {
              ...ColophonComponentData
            }
          }
        }
      }
      map {
        description
        title
        mid
      }
      slider {
        ...SliderComponentData
      }
    }
  }
`;

export default Index;
