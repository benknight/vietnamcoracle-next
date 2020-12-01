import { request, gql } from 'graphql-request';
import _ from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Collection from '../components/Collection';
import Layout, { LayoutMain } from '../components/Layout';
import Map from '../components/Map';
import PostCard from '../components/PostCard';
import SidebarDefault from '../components/SidebarDefault';
import processImages from '../lib/processImages';

const Browse = ({ category, page }) => {
  const router = useRouter();
  const { collections, map, slug, title } = page.component;
  return (
    <>
      {router.asPath === '/' && (
        <div
          className="w-full bg-black mb-8"
          style={{ paddingBottom: '36.2318%' }}></div>
      )}

      <Layout>
        <LayoutMain>
          {router.asPath !== '/' && (
            <section className="page-wrap lg:pr-0 sm:flex items-center my-2 md:my-10 lg:mt-16">
              <h1 className="font-display text-2xl md:text-4xl">
                {category ? (
                  <>
                    <span className="opacity-50">
                      <Link href={`/${slug}`}>{title}</Link> &gt;{' '}
                    </span>
                    {category.name}
                  </>
                ) : (
                  title
                )}
              </h1>
              {collections.topLevelCategory && (
                <div className="relative flex items-center justify-between w-full sm:w-auto h-10 my-4 p-3 sm:ml-4 sm:my-0 form-field tracking-wide leading-none whitespace-nowrap">
                  Browse categories… <ArrowDropDownIcon />
                  <select
                    className="absolute inset-0 opacity-0 cursor-pointer w-full"
                    onChange={event =>
                      router.push(`/${slug}/${event.target.value}`)
                    }
                    value={category?.slug ?? 'default'}>
                    <option disabled value="default">
                      Browse categories…
                    </option>
                    {collections.topLevelCategory.children.nodes.map(node => (
                      <option key={node.slug} value={node.slug}>
                        {node.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </section>
          )}
          {category ? (
            <div className="page-wrap lg:pr-0 grid gap-4 lg:gap-6 md:grid-cols-2">
              {category.posts.nodes.map(post => (
                <PostCard key={post.slug} post={post} size="medium" />
              ))}
            </div>
          ) : (
            collections.items.map(item => (
              <section className="my-2 md:my-10" key={item.title}>
                <h3 className="page-wrap font-display text-lg sm:text-xl md:text-2xl">
                  {item.title}
                </h3>
                <Collection key={item.title} data={item} />
              </section>
            ))
          )}
          <section className="mt-8 lg:mb-8 lg:pl-12">
            <Map data={map} />
          </section>
        </LayoutMain>
        <SidebarDefault data={page} />
      </Layout>
    </>
  );
};

export async function getStaticPaths() {
  const query = gql`
    {
      destinations: category(id: "destinations", idType: SLUG) {
        ...CategoryData
      }
      food: category(id: "food-and-drink", idType: SLUG) {
        ...CategoryData
      }
      guides: category(id: "motorbike-guides", idType: SLUG) {
        ...CategoryData
      }
      hotels: category(id: "hotel-reviews", idType: SLUG) {
        ...CategoryData
      }
    }
    fragment CategoryData on Category {
      id
      name
      children(first: 1000) {
        nodes {
          slug
        }
      }
    }
  `;
  const data = await request(process.env.WORDPRESS_API_URL, query);
  const result = {
    paths: [
      { params: { browse: [] } },

      { params: { browse: ['motorbike-guides'] } },
      ...data.guides.children.nodes.map(node => ({
        params: { browse: ['motorbike-guides', node.slug] },
      })),

      { params: { browse: ['hotel-reviews'] } },
      ...data.hotels.children.nodes.map(node => ({
        params: { browse: ['hotel-reviews', node.slug] },
      })),

      { params: { browse: ['food-drink'] } },
      ...data.food.children.nodes.map(node => ({
        params: { browse: ['food-drink', node.slug] },
      })),

      { params: { browse: ['destinations'] } },
      ...data.destinations.children.nodes.map(node => ({
        params: { browse: ['destinations', node.slug] },
      })),
    ],
    fallback: false,
  };
  return result;
}

const componentIDs = {
  'food-drink': 'cG9zdDozODc2NA==',
  home: 'cG9zdDozNjExNQ==',
  'hotel-reviews': 'cG9zdDozODQ2OQ==',
  destinations: 'cG9zdDozODUxNw==',
  'motorbike-guides': 'cG9zdDozODUxMQ==',
};

export async function getStaticProps({ params, preview = false }) {
  const pageQuery = gql`
    query Browse($pageID: ID!) {
      ...SidebarDefaultData
      component: component(id: $pageID) {
        ...Page
      }
    }
    fragment Page on Component {
      collections {
        items {
          title
          ...CollectionComponentData
        }
        topLevelCategory {
          children(first: 1000) {
            nodes {
              name
              slug
            }
          }
        }
      }
      map {
        ...MapComponentData
      }
      slug
      title
    }
    ${SidebarDefault.fragments}
    ${Collection.fragments}
    ${Map.fragments}
  `;

  const categoryQuery = gql`
    query Category($slug: ID!) {
      category(id: $slug, idType: SLUG) {
        id
        name
        posts(first: 1000) {
          nodes {
            slug
            ...PostCardPostData
          }
        }
        slug
      }
    }
    ${PostCard.fragments}
  `;

  const page = await request(process.env.WORDPRESS_API_URL, pageQuery, {
    pageID: componentIDs[params.browse?.[0] ?? 'home'],
  });

  await processImages(page);

  let category = null;

  if (params.browse?.[1]) {
    ({ category } = await request(
      process.env.WORDPRESS_API_URL,
      categoryQuery,
      {
        slug: params.browse[1],
      },
    ));
    await processImages(category);
  }

  return {
    props: { category, page, preview },
  };
}

export default Browse;
