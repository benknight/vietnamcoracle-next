import { graphql } from 'gatsby';
import React from 'react';
import About from '../components/About';
import Browse from '../components/Browse';
import Collection from '../components/Collection';
import Header from '../components/Header';
import Map from '../components/Map';
import Nav from '../components/Nav';
import Slider from '../components/Slider';
import Subscribe from '../components/Subscribe';
import Slider from '../components/Support';

const Index = ({ data }) => {
  return (
    <div className="pb-8 max-w-4xl mx-auto shadow-lg">
      <Nav />
      <Header />
      <Slider data={data.home.slider} />
      {data.home.collections.items.map(item => (
        <section className="my-2 md:my-8">
          <h3 className="section-heading">{item.title}</h3>
          <Collection key={item.title} data={item} />
        </section>
      ))}
      <section className="my-2 md:my-8">
        <h3 className="section-heading">Browse by category</h3>
        <Browse />
      </section>
      <section className="mt-8 mb-12">
        <Map data={data.map} />
      </section>
      <section className="mb-12">
        <About />
      </section>
      <section className="mb-20">
        <Support />
      </section>
      <section className="mb-12">
        <Subscribe />
      </section>
    </div>
  );
};

export const query = graphql`
  {
    home: wpComponent(slug: { eq: "home" }) {
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
  }
`;

export default Index;
