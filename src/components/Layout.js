import { graphql } from 'gatsby';
import React from 'react';
import About from './About';
import Browse from './Browse';
import Collection from './Collection';
import Header from './Header';
import Map from './Map';
import Nav from './Nav';
import Slider from './Slider';
import Subscribe from './Subscribe';
import Support from './Support';

const Layout = ({ data: { collections, map, slider }, showBrowse = false }) => {
  return (
    <>
      <Nav />
      <div className="md:hidden">
        <Header />
      </div>
      <Slider data={slider} />
      <div className="lg:flex">
        <div className="lg:w-2/3">
          {collections.items.map(item => (
            <section className="my-2 md:my-8" key={item.title}>
              <h3 className="section-heading">{item.title}</h3>
              <Collection key={item.title} data={item} />
            </section>
          ))}
          {showBrowse && (
            <section className="my-2 md:my-8">
              <h3 className="section-heading">Browse by category</h3>
              <div className="my-3 px-4 lg:pl-8 lg:pr-0">
                <Browse />
              </div>
            </section>
          )}
          <section className="mt-8 lg:mb-8 lg:pl-8">
            <Map data={map} />
          </section>
        </div>
        <div className="lg:w-1/3">
          <div
            className="
              lg:h-full lg:px-6 py-12 lg:pb-0 lg:ml-8
              lg:flex lg:items-end
              bg-gray-100 dark:bg-gray-800 dark:bg-opacity-25 lg:shadow">
            <div style={{ position: 'sticky', bottom: 0 }}>
              <section className="mb-20">
                <Support />
              </section>
              <section className="mb-12">
                <About />
              </section>
              <section className="mb-12">
                <Subscribe />
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const query = graphql`
  fragment LayoutComponentData on WpComponent {
    collections {
      items {
        title
        ...CollectionComponentData
      }
    }
    map {
      ...MapComponentData
    }
    slider {
      ...SliderComponentData
    }
  }
`;

export default Layout;
