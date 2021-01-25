import { gql } from 'graphql-request';
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
import Hero from '../../components/Hero';
import Layout, { LayoutMain } from '../../components/Layout';
import Map from '../../components/Map';
import PostCard from '../../components/PostCard';
import SidebarDefault from '../../components/SidebarDefault';
import getAPIClient from '../../lib/getAPIClient';

const Browse = ({ data }) => {
  const router = useRouter();
  const isHome = !router.query.browse;
  const { category, categoryPage, subcategory } = data;
  const coverImgSm = subcategory?.cover.small || category?.cover.small;
  const coverImgLg = subcategory?.cover.large || category?.cover.large;
  return (
    <>
      <Head>
        <title>
          {!category
            ? 'Vietnam Coracle'
            : subcategory
            ? `${category.name} > ${subcategory.name}`
            : category.name}
          {!isHome ? ' – Vietnam Coracle' : ''}
        </title>
      </Head>
      {isHome && (
        <>
          <div className="hidden md:flex">
            <Image
              alt=""
              height="580"
              loading="eager"
              src="/slider-wide.jpg"
              width="1600"
            />
          </div>
          <div className="flex md:hidden">
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
        <Hero imgSm={coverImgSm} imgLg={coverImgLg}>
          <div className="flex-auto flex flex-wrap items-center justify-between">
            <h1 className="text-2xl md:text-3xl lg:text-4xl sm:mr-6 font-display leading-tight">
              {subcategory ? (
                <>
                  <span className="inline-block opacity-70 leading-normal">
                    <Link href={`/browse/${category.slug}`}>
                      {category.name}
                    </Link>
                    &nbsp;&gt;&nbsp;
                  </span>
                  <span className="inline-block leading-normal">
                    {subcategory.name}
                  </span>
                </>
              ) : (
                category.name
              )}
            </h1>
            {categoryPage?.map && !subcategory && (
              <a
                className="my-2 md:order-1 lg:order-1 inline-flex items-center text-sm hover:underline"
                href="#map">
                <MapIcon className="mr-2" />
                Jump to map
              </a>
            )}
            {category.children.nodes.length > 0 && (
              <div className="flex-auto w-full md:w-auto lg:w-auto">
                <div className="relative inline-flex items-center justify-between w-full md:w-auto lg:w-auto h-10 mt-3 md:mt-0 lg:mt-0 p-3 rounded text-sm border bg-transparent tracking-wide leading-none whitespace-nowrap">
                  Browse subcategories…
                  <ArrowDropDownIcon className="ml-2" />
                  <select
                    className="absolute inset-0 opacity-0 cursor-pointer w-full"
                    onChange={event => router.push(event.target.value)}
                    value={
                      subcategory?.uri.replace('category', 'browse') ??
                      'default'
                    }>
                    <option disabled value="default">
                      Browse subcategories…
                    </option>
                    {category.children.nodes
                      .filter(node => node.posts.nodes.length > 0)
                      .map(node => (
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
        </Hero>
      )}
      <Layout>
        <LayoutMain>
          {categoryPage && !subcategory ? (
            categoryPage.collections?.items.map(item => (
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
            <div className="page-wrap pt-8 lg:pr-0 grid gap-4 xl:gap-6 md:grid-cols-2 lg:grid-cols-2">
              {(subcategory || category).posts.nodes.map(post => (
                <PostCard key={post.slug} post={post} flex />
              ))}
            </div>
          )}
          {categoryPage?.map && (
            <section className="mt-8 lg:mb-8 lg:pl-4 xl:pl-12">
              <Map data={categoryPage.map} />
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
  const client = getAPIClient();
  const data = await client.request(query);
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

// TODO: It's not possible to previews via the `asPreview` argument with slugs or uri's as IDs, hence this mapping.
// Tracking issue: https://github.com/wp-graphql/wp-graphql/issues/1673
const catPageIds = {
  'food-and-drink': 'cG9zdDozODc2NA==',
  home: 'cG9zdDozNjExNQ==',
  'hotel-reviews': 'cG9zdDozODQ2OQ==',
  destinations: 'cG9zdDozODUxNw==',
  'motorbike-guides': 'cG9zdDozODUxMQ==',
};

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
}) => {
  const query = gql`
    query Browse(
      $categoryPageId: ID!
      $categorySlug: ID!
      $hasCategoryPage: Boolean!
      $hasSubcategory: Boolean!
      $preview: Boolean!
      $skipCategoryPosts: Boolean!
      $subcategorySlug: ID!
    ) {
      category(id: $categorySlug, idType: SLUG) {
        slug
        children(first: 1000) {
          nodes {
            name
            uri
            posts {
              nodes {
                id
              }
            }
          }
        }
        posts(first: 1000) @skip(if: $skipCategoryPosts) {
          nodes {
            slug
            ...PostCardPostData
          }
        }
        ...CategoryData
      }
      categoryPage(id: $categoryPageId, asPreview: $preview)
        @include(if: $hasCategoryPage) {
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
        map {
          ...MapComponentData
        }
      }
      subcategory: category(id: $subcategorySlug, idType: SLUG)
        @include(if: $hasSubcategory) {
        ...CategoryData
        posts(first: 1000) {
          nodes {
            slug
            ...PostCardPostData
          }
        }
      }
      ...FooterData
      ...SidebarDefaultData
    }
    fragment CategoryData on Category {
      name
      uri
      cover {
        small {
          sourceUrl
          mediaDetails {
            height
            width
          }
        }
        large {
          sourceUrl
          mediaDetails {
            height
            width
          }
        }
      }
    }
    ${Collection.fragments}
    ${Footer.fragments}
    ${Map.fragments}
    ${SidebarDefault.fragments}
  `;

  const categorySlug = params.browse?.[0] ?? '';
  const categoryPageId = catPageIds[categorySlug || 'home'] || '';
  const subcategorySlug = params.browse?.[1] ?? '';
  const data = await getAPIClient().request(query, {
    categoryPageId,
    categorySlug,
    hasCategoryPage: Boolean(categoryPageId),
    hasSubcategory: Boolean(subcategorySlug),
    preview,
    skipCategoryPosts:
      Boolean(subcategorySlug) ||
      [
        'home',
        'motorbike-guides',
        'food-and-drink',
        'hotel-reviews',
        'destinations',
      ].includes(categorySlug), // TODO: Alternatively query for which categorys have pages?
    subcategorySlug,
  });

  return {
    props: { data, preview },
    revalidate: 1,
  };
};

export default Browse;
