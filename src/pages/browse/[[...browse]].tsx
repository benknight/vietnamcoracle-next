import { request, gql } from 'graphql-request';
import _ from 'lodash';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import MapIcon from '@material-ui/icons/Map';
import Collection from '../../components/Collection';
import Footer from '../../components/Footer';
import Layout, { LayoutMain } from '../../components/Layout';
import Map from '../../components/Map';
import PostCard from '../../components/PostCard';
import SidebarDefault from '../../components/SidebarDefault';
import getAPIClient from '../../lib/getAPIClient';

const Browse = ({ data, preview }) => {
  const router = useRouter();
  const isHome = !router.query.browse;
  const { category, component } = data;
  const topLevelCategory =
    category?.parentId === null
      ? category
      : category?.ancestors.nodes.find(c => c.parentId === null);
  return (
    <>
      <Head>
        <title>
          {isHome
            ? 'Vietnam Coracle'
            : topLevelCategory.id !== category.id
            ? `${topLevelCategory.name} > ${category.name}`
            : category.name}
          {!isHome ? ' – Vietnam Coracle' : ''}
        </title>
      </Head>
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
      {!isHome && component && (
        <section className="relative text-gray-100 bg-gray-300 dark:bg-gray-950">
          {component.cover?.image?.sourceUrl && (
            <Image
              className="absolute inset-0 opacity-90"
              layout="fill"
              objectFit="cover"
              src={component.cover.image.sourceUrl}
            />
          )}
          <div className="page-wrap relative sm:flex items-end pb-5 md:pb-8 pt-32 md:pt-48 lg:pt-56 bg-gradient-to-t from-gray-900 via-black-25 to-transparent">
            <div className="flex-auto flex flex-wrap items-center justify-between">
              <h1 className="font-display text-2xl md:text-3xl lg:text-4xl sm:mr-6">
                {topLevelCategory.id !== category.id ? (
                  <>
                    <span className="inline-block opacity-70 leading-normal">
                      <Link href={`/browse/${topLevelCategory.slug}`}>
                        {topLevelCategory.name}
                      </Link>
                      &nbsp;&gt;&nbsp;
                    </span>
                    <span className="inline-block leading-normal">
                      {category.name}
                    </span>
                  </>
                ) : (
                  category.name
                )}
              </h1>
              {component?.map &&
                (isHome || topLevelCategory.id === category.id) && (
                  <a
                    className="mt-2 md:order-1 inline-flex items-center text-sm hover:underline"
                    href="#map">
                    <MapIcon className="mr-2" />
                    Jump to map
                  </a>
                )}
              {component && (
                <div className="flex-auto">
                  <div className="relative inline-flex items-center justify-between w-full sm:w-auto h-10 mt-3 md:mt-0 p-3 rounded text-sm text-gray-100 border border-white bg-transparent tracking-wide leading-none whitespace-nowrap">
                    Browse subcategories…
                    <ArrowDropDownIcon className="ml-2" />
                    <select
                      className="absolute inset-0 opacity-0 cursor-pointer w-full"
                      onChange={event => router.push(event.target.value)}
                      value={
                        category?.uri.replace('category', 'browse') ?? 'default'
                      }>
                      <option disabled value="default">
                        Browse subcategories…
                      </option>
                      {topLevelCategory.children.nodes.map(node => (
                        <option
                          key={node.uri}
                          value={node.uri.replace('category', 'browse')}>
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
          {component && (isHome || topLevelCategory.id === category.id) ? (
            component.collections.items.map(item => (
              <section className="my-5 md:my-10" key={item.title}>
                <div className="page-wrap flex items-baseline justify-between md:justify-start">
                  <h3 className="font-display text-xl md:text-2xl lg:text-3xl">
                    {item.title}
                  </h3>
                  {item.category && (
                    <Link
                      href={item.category.uri.replace('category', 'browse')}>
                      <a className="link ml-4 text-sm">View all</a>
                    </Link>
                  )}
                </div>
                <Collection key={item.title} data={item} />
              </section>
            ))
          ) : (
            <>
              {!component && (
                <h3 className="mt-8 page-wrap font-display text-xl md:text-2xl lg:text-3xl">
                  {category.name}
                </h3>
              )}
              <div className="page-wrap pt-6 lg:pr-0 grid gap-4 lg:gap-6 md:grid-cols-2">
                {category.posts.nodes.map(post => (
                  <PostCard key={post.slug} post={post} flex />
                ))}
              </div>
            </>
          )}
          {component?.map && (
            <section className="mt-8 lg:mb-8 lg:pl-12">
              <Map data={component.map} />
            </section>
          )}
        </LayoutMain>
        <SidebarDefault data={data} />
      </Layout>
      <Footer data={data} />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const query = gql`
    {
      categories(first: 1000) {
        nodes {
          uri
        }
      }
    }
  `;
  const data = await request(process.env.WORDPRESS_API_URL, query);
  const getComponentsFromURI = (uri: string): string[] => {
    // "/category/blah/" => ["blah"]
    return uri
      .split('/')
      .filter(s => s.length > 0)
      .slice(1);
  };
  return {
    paths: [
      { params: { browse: [] } },
      ...data.categories.nodes.map(node => ({
        params: {
          browse: getComponentsFromURI(node.uri),
        },
      })),
    ],
    fallback: false,
  };
};

const componentIds = {
  'food-and-drink': 'cG9zdDozODc2NA==',
  home: 'cG9zdDozNjExNQ==',
  'hotel-reviews': 'cG9zdDozODQ2OQ==',
  destinations: 'cG9zdDozODUxNw==',
  'motorbike-guides': 'cG9zdDozODUxMQ==',
};

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
  previewData,
}) => {
  const query = gql`
    query Browse(
      $categorySlug: ID!
      $componentId: ID!
      $hasCategory: Boolean!
      $hasComponent: Boolean!
      $skipPosts: Boolean!
    ) {
      category(id: $categorySlug, idType: SLUG) @include(if: $hasCategory) {
        ancestors(first: 1000) {
          nodes {
            ...CategoryMetaData
          }
        }
        posts(first: 1000) @skip(if: $skipPosts) {
          nodes {
            slug
            ...PostCardPostData
          }
        }
        ...CategoryMetaData
      }
      component(id: $componentId, idType: ID) @include(if: $hasComponent) {
        slug
        title
        collections {
          items {
            title
            category {
              slug
              uri
            }
            ...CollectionComponentData
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
      ...FooterData
      ...SidebarDefaultData
    }
    fragment CategoryMetaData on Category {
      id
      name
      parentId
      slug
      uri
      children(first: 1000) {
        nodes {
          name
          uri
        }
      }
    }
    ${Collection.fragments}
    ${Footer.fragments}
    ${Map.fragments}
    ${SidebarDefault.fragments}
  `;

  let componentId = componentIds[params.browse?.[0] ?? 'home'] || '';

  if (preview && previewData.component?.id === componentId) {
    componentId = previewData.component.previewRevisionId;
  }

  const categorySlug = params.browse?.[params.browse.length - 1] ?? '';

  const client = getAPIClient();

  const data = await client.request(query, {
    categorySlug,
    componentId,
    hasCategory: Boolean(categorySlug),
    hasComponent: Boolean(componentId),
    skipPosts: Boolean(componentId) && params.browse?.length === 1,
  });

  return {
    props: { data, preview },
    revalidate: 1,
  };
};

export default Browse;
