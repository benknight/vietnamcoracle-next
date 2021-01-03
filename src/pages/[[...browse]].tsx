import { request, gql } from 'graphql-request';
import _ from 'lodash';
import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import MapIcon from '@material-ui/icons/Map';
import Collection from '../components/Collection';
import Layout, { LayoutMain } from '../components/Layout';
import Map from '../components/Map';
import PostCard from '../components/PostCard';
import SidebarDefault from '../components/SidebarDefault';

const Browse = ({ category, page }) => {
  const router = useRouter();
  const { collections, cover, map, slug, title } = page.component;
  const isHome = router.asPath === '/';
  return (
    <>
      {isHome && (
        <>
          <div className="hidden md:block">
            <Image
              alt=""
              height="580"
              loading="eager"
              src="/slider-wide.jpg"
              width="1600"
            />
          </div>
          <div className="block md:hidden">
            <Image
              alt=""
              height="1024"
              loading="eager"
              src="/slider-square.jpg"
              width="1024"
            />
          </div>
        </>
      )}
      {!isHome && (
        <section className="relative text-gray-100 bg-gray-300 dark:bg-gray-950">
          {cover?.image?.sourceUrl && (
            <Image
              className="absolute inset-0 opacity-90"
              layout="fill"
              objectFit="cover"
              src={cover.image.sourceUrl}
            />
          )}
          <div className="page-wrap relative sm:flex items-end pb-5 md:pb-8 pt-32 md:pt-48 lg:pt-56 bg-gradient-to-t from-gray-900 via-black-25 to-transparent">
            <div className="flex-auto flex flex-wrap items-center md:items-end justify-between">
              <h1 className="font-display text-2xl md:text-3xl lg:text-4xl sm:mr-4">
                {category ? (
                  <>
                    <span className="inline-block opacity-50 leading-normal">
                      <Link href={`/${slug}`}>{title}</Link>
                      &nbsp;&gt;&nbsp;
                    </span>
                    <span className="inline-block leading-normal">
                      {category.name}
                    </span>
                  </>
                ) : (
                  title
                )}
              </h1>
              {!category && (
                <a
                  className="mt-2 md:order-1 inline-flex items-center text-sm hover:underline"
                  href="#map">
                  <MapIcon className="mr-2" />
                  Jump to map
                </a>
              )}
              {collections.topLevelCategory && (
                <div className="flex-auto">
                  <div className="relative inline-flex items-center justify-between w-full sm:w-auto h-10 mt-3 p-3 rounded text-sm text-gray-100 border border-white bg-transparent tracking-wide leading-none whitespace-nowrap">
                    Browse subcategories…
                    <ArrowDropDownIcon className="ml-2" />
                    <select
                      className="absolute inset-0 opacity-0 cursor-pointer w-full"
                      onChange={event =>
                        router.push(`/${slug}/${event.target.value}`)
                      }
                      value={category?.slug ?? 'default'}>
                      <option disabled value="default">
                        Browse subcategories…
                      </option>
                      {collections.topLevelCategory.children.nodes.map(node => (
                        <option key={node.slug} value={node.slug}>
                          {node.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
      <Layout>
        <LayoutMain>
          {category ? (
            <div className="page-wrap pt-6 lg:pr-0 grid gap-4 lg:gap-6 md:grid-cols-2">
              {category.posts.nodes.map(post => (
                <PostCard key={post.slug} post={post} flex />
              ))}
            </div>
          ) : (
            collections.items.map(item => (
              <section className="my-5 md:my-10" key={item.title}>
                <div className="page-wrap flex items-baseline justify-between md:justify-start">
                  <h3 className="font-display text-xl md:text-2xl lg:text-3xl">
                    {item.title}
                  </h3>
                  <Link href={`/browse/${item.slug}`}>
                    <a className="link ml-4 text-sm">View all</a>
                  </Link>
                </div>
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

export const getStaticPaths: GetStaticPaths = async () => {
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
  return {
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
};

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
}) => {
  const pageQuery = gql`
    query Browse($slug: ID!) {
      ...SidebarDefaultData
      component: component(id: $slug, idType: SLUG) {
        ...BrowsePage
      }
    }
    fragment BrowsePage on Component {
      slug
      title
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
      cover {
        image {
          sourceUrl
        }
      }
      map {
        ...MapComponentData
      }
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
    slug: params.browse?.[0] ?? 'home',
  });

  let category = null;

  if (params.browse?.[1]) {
    ({ category } = await request(
      process.env.WORDPRESS_API_URL,
      categoryQuery,
      {
        slug: params.browse[1],
      },
    ));
  }

  return {
    props: { category, page, preview },
    revalidate: 1,
  };
};

export default Browse;
