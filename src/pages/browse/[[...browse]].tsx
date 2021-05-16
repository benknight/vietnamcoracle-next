import { gql } from 'graphql-request';
import _ from 'lodash';
import type { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import vibrant from 'node-vibrant';
import { MapIcon } from '@heroicons/react/outline';
import { ChevronDownIcon } from '@heroicons/react/solid';
import Collection from '../../components/Collection';
import Footer from '../../components/Footer';
import Hero, { HeroContent } from '../../components/Hero';
import Layout, { LayoutMain, LayoutSidebar } from '../../components/Layout';
import Map from '../../components/Map';
import PostCard, { SwatchesContext } from '../../components/PostCard';
import SEO from '../../components/SEO';
import SidebarDefault from '../../components/SidebarDefault';
import Slider from '../../components/Slider';
import getCategoryLink from '../../lib/getCategoryLink';
import GraphQLClient from '../../lib/GraphQLClient';

const Browse = ({ data, swatches }) => {
  const router = useRouter();
  const isHome = !router.query.browse;
  const { category, subcategory } = data;
  const coverImgSm =
    (subcategory ? subcategory.cover.small : category.cover.small) ||
    category.parent.node.cover.small;
  const coverImgLg =
    (subcategory ? subcategory.cover.large : category.cover.large) ||
    category?.parent.node.cover.large;
  return (
    <SwatchesContext.Provider value={swatches}>
      <SEO {...category.seo} />
      {isHome ? (
        <Slider data={category.slider} />
      ) : (
        <Hero imgSm={coverImgSm} imgLg={coverImgLg}>
          <HeroContent>
            <div className="page-wrap pb-4 flex-auto flex flex-wrap md:flex-nowrap items-end justify-between">
              <h1 className="mt-8 sm:mr-6 font-display">
                {subcategory ? (
                  <div className="text-2xl sm:text-3xl lg:text-4xl leading-normal sm:leading-tight">
                    <span className="inline-block text-gray-300 opacity-90">
                      <Link href={getCategoryLink(category.uri)}>
                        {category.name}
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
              <section className="my-6 md:my-10" key={item.title}>
                <div className="page-wrap flex items-baseline justify-between md:justify-start">
                  <h3 className="mb-1 font-display text-lg xs:text-xl sm:text-2xl lg:text-3xl 2xl:text-4xl">
                    {item.title}
                  </h3>
                  {item.category && (
                    <Link href={getCategoryLink(item.category.uri)}>
                      <a className="link ml-4 text-sm font-serif whitespace-nowrap">
                        See all
                      </a>
                    </Link>
                  )}
                </div>
                <Collection key={item.title} data={item} />
              </section>
            ))
          ) : (
            <div className="page-wrap pt-8 lg:pr-0 grid gap-4 xl:gap-6 md:grid-cols-2">
              {(subcategory || category).posts.nodes.map(post => (
                <PostCard key={post.slug} post={post} inGrid />
              ))}
            </div>
          )}
          {category.map && (
            <section className="mt-8 lg:mb-8 lg:px-8 xl:pl-12 xl:pr-0">
              <Map data={category.map} isHome={isHome} />
            </section>
          )}
        </LayoutMain>
        <LayoutSidebar>
          <SidebarDefault data={data} />
          <Footer data={data} />
        </LayoutSidebar>
      </Layout>
    </SwatchesContext.Provider>
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
    fallback: false,
  };
  return result;
};

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
}) => {
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
            ...PostCardPostData
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
          ...HeroImageData
        }
        large {
          ...HeroImageData
        }
      }
      seo {
        ...SEOCategoryData
      }
    }
    ${Collection.fragments}
    ${Footer.fragments}
    ${Map.fragments}
    ${SEO.fragments.category}
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

  let swatches = {};

  // Generate swatches
  if (process.env.NODE_ENV === 'production') {
    const thumbnails = (
      JSON.stringify(data).match(
        /\{[^\{]*"__typename":\s*"MediaItem"[^\}]*\}/g,
      ) || []
    ).map(match => JSON.parse(match));
    const results = (
      await Promise.all(
        thumbnails.map(t =>
          vibrant
            .from(
              `https://res.cloudinary.com/vietnam-coracle/image/fetch/a_vflip,c_fill,e_blur:2000,g_north,h_75,w_150/${t.sourceUrlFx}`,
            )
            .getPalette(),
        ),
      )
    ).map(palette => palette.DarkMuted.hex);
    for (let i = 0; i < thumbnails.length; i++) {
      swatches[thumbnails[i].id] = results[i];
    }
  }

  return {
    props: { data, preview, swatches },
    revalidate: 1,
  };
};

export default Browse;
