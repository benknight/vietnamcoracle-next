import { gql } from 'graphql-request';
import htmlToReact from 'html-react-parser';
import _ from 'lodash';
import type { InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MapIcon } from '@heroicons/react/outline';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { Tab } from '@headlessui/react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Collection from '../../components/Collection';
import Footer from '../../components/Footer';
import GridListTabs from '../../components/GridListTabs';
import Hero, { HeroContent } from '../../components/Hero';
import Layout, { LayoutMain, LayoutSidebar } from '../../components/Layout';
import Map from '../../components/Map';
import PostCard, { SwatchesProvider } from '../../components/PostCard';
import PostMediaBlock from '../../components/PostMediaBlock';
import SidebarDefault from '../../components/SidebarDefault';
import Slider from '../../components/Slider';
import breakpoints from '../../config/breakpoints';
import generateSwatches from '../../lib/generateSwatches';
import getCategoryLink from '../../lib/getCategoryLink';
import GraphQLClient from '../../lib/GraphQLClient';

const Browse = ({
  data,
  swatches,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();
  const isMd = useMediaQuery(`(min-width: ${breakpoints.md})`);
  const isHome = !router.query.browse;
  const { category, subcategory } = data;
  const coverImgSm =
    (subcategory ? subcategory.cover.small : category.cover.small) ||
    data.defaultImages?.cover.small;
  const coverImgLg =
    (subcategory ? subcategory.cover.large : category.cover.large) ||
    data.defaultImages?.cover.large;
  return (
    <SwatchesProvider value={swatches}>
      <Head>{htmlToReact(category.seo.fullHead)}</Head>
      {isHome ? (
        <Slider data={category.slider} />
      ) : (
        <Hero imgSm={coverImgSm} imgLg={coverImgLg} theme="dark">
          <HeroContent>
            <div className="page-wrap pb-4 flex-auto flex flex-wrap md:flex-nowrap items-end justify-between">
              <h1 className="mt-8 sm:mr-6 font-display">
                {subcategory ? (
                  <div className="text-2xl sm:text-3xl lg:text-4xl leading-normal sm:leading-tight">
                    <span className="inline-block text-gray-300 opacity-90">
                      <Link href={getCategoryLink(category.uri)}>
                        <a className="hover:underline">{category.name}</a>
                      </Link>
                      &nbsp;&gt;&nbsp;
                    </span>
                    <span className="inline-block">{subcategory.name}</span>
                  </div>
                ) : (
                  <div className="text-4xl md:text-3xl lg:text-5xl leading-tight">
                    {category.name}
                  </div>
                )}
              </h1>
              {category.map && !subcategory && (
                <a
                  className="self-end hidden md:inline-flex lg:inline-flex my-2 md:my-0 md:order-1 items-end text-sm hover:underline"
                  href="#map">
                  <MapIcon className="w-5 h-5 mr-2" />
                  Jump to map
                </a>
              )}
              {category.children.nodes.length > 0 && (
                <div className="flex-auto w-full md:w-auto">
                  <div className="relative inline-flex items-center justify-between w-full md:w-auto h-10 mt-3 p-3 rounded text-sm border bg-black bg-opacity-50 tracking-wide leading-none whitespace-nowrap">
                    Browse subcategories…
                    <ChevronDownIcon className="w-4 h-4 ml-2" />
                    <select
                      className="absolute inset-0 opacity-0 cursor-pointer w-full text-black"
                      onChange={event =>
                        router.push(getCategoryLink(event.target.value))
                      }
                      value={subcategory?.uri ?? 'default'}>
                      <option disabled value="default">
                        Browse subcategories…
                      </option>
                      {category.children.nodes
                        .filter(node => node.posts.nodes.length > 0)
                        .map(node => (
                          <option key={node.uri} value={node.uri}>
                            {node.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </HeroContent>
        </Hero>
      )}
      <Layout>
        <LayoutMain>
          {category && !subcategory ? (
            category.collections?.items.map(item => (
              <section
                className="my-6 md:my-12 md:dark:mt-4 xl:pr-8"
                key={item.title}>
                <div className="page-wrap flex items-baseline justify-between md:justify-start">
                  <h3 className="mb-1 font-display text-lg xs:text-xl sm:text-2xl lg:text-3xl 2xl:text-4xl">
                    {item.title}
                  </h3>
                  {item.category && (
                    <Link href={getCategoryLink(item.category.uri)}>
                      <a className="link ml-4 text-sm font-sans whitespace-nowrap">
                        See all
                      </a>
                    </Link>
                  )}
                </div>
                <Collection key={item.title} data={item} />
              </section>
            ))
          ) : (
            <Tab.Group
              as="div"
              className="pb-8 min-h-screen bg-gray-100 dark:bg-black lg:bg-transparent"
              defaultIndex={isMd ? 1 : 0}
              manual>
              <div className="pt-6 px-8 flex justify-center lg:justify-start">
                <GridListTabs />
              </div>
              <Tab.Panels>
                <Tab.Panel>
                  <div className="px-2 lg:px-8 pt-6 grid gap-4 xl:gap-6 md:grid-cols-2">
                    {(subcategory || category).posts.nodes.map(post => (
                      <PostCard key={post.slug} data={post} inGrid />
                    ))}
                  </div>
                </Tab.Panel>
                <Tab.Panel>
                  <div className="px-2 py-4 lg:px-8">
                    {(subcategory || category).posts.nodes.map(post => (
                      <PostMediaBlock key={post.slug} data={post} />
                    ))}
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          )}
          {category.map && (
            <section className="lg:mb-8 lg:px-8">
              <Map data={category.map} />
            </section>
          )}
        </LayoutMain>
        <LayoutSidebar showBorder={Boolean(subcategory)}>
          <SidebarDefault data={data} />
          <Footer data={data} />
        </LayoutSidebar>
      </Layout>
    </SwatchesProvider>
  );
};

export const getStaticPaths = async () => {
  const query = gql`
    {
      category(id: "features-guides", idType: SLUG) {
        children(first: 1000) {
          nodes {
            uri
            children(first: 1000) {
              nodes {
                uri
              }
            }
          }
        }
      }
    }
  `;
  const data = await GraphQLClient.request(query);
  const getComponentsFromURI = (uri: string): string[] => {
    // "/category/blah/" => ["blah"]
    return uri
      .replace('/category/features-guides/', '')
      .split('/')
      .filter(s => s.length > 0);
  };
  const result = {
    paths: [
      { params: { browse: [] } },
      ..._.flatten(
        data.category.children.nodes.map(node => {
          return [
            { params: { browse: getComponentsFromURI(node.uri) } },
            ...node.children.nodes.map(node => ({
              params: { browse: getComponentsFromURI(node.uri) },
            })),
          ];
        }),
      ),
    ],
    fallback: 'blocking',
  };
  return result;
};

export const getStaticProps = async ({ params, preview = false }) => {
  const query = gql`
    query Browse(
      $categorySlug: ID!
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
        parent {
          node {
            ...CategoryData
          }
        }
        posts(first: 1000) @skip(if: $skipCategoryPosts) {
          nodes {
            slug
            ...PostCardData
          }
        }
        slider {
          ...SliderComponentData
        }
        ...CategoryData
      }
      seo {
        openGraph {
          frontPage {
            title
            description
            image {
              mediaDetails {
                height
                width
              }
              sourceUrl
            }
          }
        }
      }
      subcategory: category(id: $subcategorySlug, idType: SLUG)
        @include(if: $hasSubcategory) {
        ...CategoryData
        posts(first: 1000) {
          nodes {
            slug
            ...PostMediaBlockData
            ...PostCardData
          }
        }
      }
      defaultImages {
        cover {
          large {
            ...HeroImageData
          }
          small {
            ...HeroImageData
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
          ...HeroImageData
        }
        large {
          ...HeroImageData
        }
      }
      seo {
        fullHead
      }
    }
    ${Collection.fragments}
    ${Footer.fragments}
    ${Map.fragments}
    ${PostMediaBlock.fragments}
    ${SidebarDefault.fragments}
    ${Slider.fragments}
  `;

  const categorySlug = params.browse?.[0] ?? 'features-guides';
  const subcategorySlug = params.browse?.[1] ?? '';

  // Fire the request
  const data = await GraphQLClient.request(query, {
    categorySlug,
    subcategorySlug,
    hasSubcategory: Boolean(subcategorySlug),
    preview,
    skipCategoryPosts:
      Boolean(subcategorySlug) ||
      [
        'features-guides',
        'motorbike-guides',
        'food-and-drink',
        'hotel-reviews',
        'destinations',
      ].includes(categorySlug),
  });

  return {
    props: {
      data,
      preview,
      swatches: await generateSwatches(JSON.stringify(data)),
    },
    revalidate: 1,
  };
};

export default Browse;
