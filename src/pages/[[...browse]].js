import { request, gql } from 'graphql-request';
import _camelCase from 'lodash/camelCase';
import { useRouter } from 'next/router';
import About from '../components/About';
import Block from '../components/Block';
// import Browse from '../components/Browse';
import Collection from '../components/Collection';
import Map from '../components/Map';
import Nav from '../components/Nav';
import Slider from '../components/Slider';
import Subscribe from '../components/Subscribe';
import Support from '../components/Support';
import getSwatches from '../lib/getSwatches';

const Page = ({ data, swatches }) => {
  const router = useRouter();
  const componentName =
    router.asPath === '/' ? 'home' : _camelCase(router.asPath.replace('/', ''));
  const { collections, map, slider } = data[componentName];
  return (
    <>
      <Nav />
      <Slider data={slider} />
      <div className="lg:flex">
        <div className="lg:w-2/3">
          {collections.items.map(item => (
            <section className="my-2 md:my-10" key={item.title}>
              <h3 className="px-4 lg:px-12 font-display text-lg sm:text-xl md:text-2xl">
                {item.title}
              </h3>
              <Collection key={item.title} data={item} swatches={swatches} />
            </section>
          ))}
          {/* {componentName === 'home' && (
            <section className="my-2 md:my-10">
              <h3 className="px-4 lg:px-12 font-display text-lg sm:text-xl md:text-2xl">
                Browse by category
              </h3>
              <div className="my-3 px-4 lg:pl-12 lg:pr-0">
                <Browse />
              </div>
            </section>
          )} */}
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
                <About data={data.about.block} />
              </section>
              <section className="mb-20">
                <Support data={data.support.block} />
              </section>
              <section className="mb-12">
                <Subscribe data={data.subscribe.block} />
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
      { params: { browse: [] } },
      { params: { browse: ['motorbike-browses'] } },
      { params: { browse: ['hotel-reviews'] } },
      { params: { browse: ['food-drink'] } },
      { params: { browse: ['destinations'] } },
    ],
    fallback: false,
  };
}

export async function getStaticProps({ preview = false }) {
  const query = gql`
    {
      about: component(id: "cG9zdDozNjExOA==") {
        ...Block
      }
      foodDrink: component(id: "cG9zdDozODc2NA==") {
        ...Page
      }
      home: component(id: "cG9zdDozNjExNQ==") {
        ...Page
      }
      hotelReviews: component(id: "cG9zdDozODQ2OQ==") {
        ...Page
      }
      destinations: component(id: "cG9zdDozODUxNw==") {
        ...Page
      }
      motorbikeGuides: component(id: "cG9zdDozODUxMQ==") {
        ...Page
      }
      subscribe: component(id: "cG9zdDozNzcwNQ==") {
        ...Block
      }
      support: component(id: "cG9zdDozNzY4Nw==") {
        ...Block
      }
    }
    fragment Page on Component {
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
    fragment Block on Component {
      block {
        ...BlockComponentData
      }
    }
    ${Block.fragments}
    ${Collection.fragments}
    ${Map.fragments}
    ${Slider.fragments}
  `;
  const data = await request(process.env.WORDPRESS_API_URL, query);
  const swatches = await getSwatches();
  return {
    props: { data, preview, swatches },
  };
}

export default Page;
