import { request, gql } from 'graphql-request';
import React from 'react';
import About from '../components/About';
import Block from '../components/Block';
import Browse from '../components/Browse';
import Collection from '../components/Collection';
import Map from '../components/Map';
import Slider from '../components/Slider';
import Subscribe from '../components/Subscribe';
import Support from '../components/Support';

const Page = ({
  data: {
    about,
    component: { collections, map, slider },
    subscribe,
    support,
  },
  showBrowse,
}) => {
  return (
    <>
      <Slider data={slider} />
      <div className="lg:flex">
        <div className="lg:w-2/3">
          {collections.items.map(item => (
            <section className="my-2 md:my-10" key={item.title}>
              <h3 className="px-4 lg:px-12 font-display text-lg sm:text-xl md:text-2xl">
                {item.title}
              </h3>
              <Collection key={item.title} data={item} />
            </section>
          ))}
          {showBrowse && (
            <section className="my-2 md:my-10">
              <h3 className="px-4 lg:px-12 font-display text-lg sm:text-xl md:text-2xl">
                Browse by category
              </h3>
              <div className="my-3 px-4 lg:pl-12 lg:pr-0">
                <Browse />
              </div>
            </section>
          )}
          <section className="mt-8 lg:mb-8 lg:pl-12">
            <Map data={map} />
          </section>
        </div>
        <div className="lg:w-1/3">
          <div
            className="
              lg:h-full lg:px-6 py-12 lg:pb-0
              lg:flex lg:items-end">
            <div
              className="flex-auto"
              style={{ position: 'sticky', bottom: 0 }}>
              <section className="mb-20">
                <About data={about.block} />
              </section>
              <section className="mb-20">
                <Support data={support.block} />
              </section>
              <section className="mb-12">
                <Subscribe data={subscribe.block} />
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export function getStaticPaths() {
  return {
    paths: [
      { params: { slug: [] } },
      { params: { slug: ['motorbike-guides'] } },
      { params: { slug: ['hotel-reviews'] } },
      { params: { slug: ['food-drink'] } },
      { params: { slug: ['destinations'] } },
    ],
    fallback: false,
  };
}

const componentIDs = {
  destinations: 'cG9zdDozODUxNw==',
  home: 'cG9zdDozNjExNQ==',
  'food-drink': 'cG9zdDozODc2NA==',
  'motorbike-guides': 'cG9zdDozODUxMQ==',
  'hotel-reviews': 'cG9zdDozODQ2OQ==',
};

export async function getStaticProps({ params, preview = false }) {
  const query = gql`
    query Page($slug: ID!) {
      about: component(id: "cG9zdDozNjExOA==") {
        block {
          ...BlockComponentData
        }
      }
      component: component(id: $slug) {
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
      subscribe: component(id: "cG9zdDozNzcwNQ==") {
        block {
          ...BlockComponentData
        }
      }
      support: component(id: "cG9zdDozNzY4Nw==") {
        block {
          ...BlockComponentData
        }
      }
    }
    ${Block.fragments}
    ${Collection.fragments}
    ${Map.fragments}
    ${Slider.fragments}
  `;
  const data = await request(process.env.WORDPRESS_API_URL, query, {
    slug: componentIDs[params.slug || 'home'],
  });
  return {
    props: { data, preview },
  };
}

export default Page;
