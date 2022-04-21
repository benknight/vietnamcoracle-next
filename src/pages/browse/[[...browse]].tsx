import cx from 'classnames';
import { gql } from 'graphql-request';
import htmlToReact from 'html-react-parser';
import _ from 'lodash';
import type { InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { MapIcon } from '@heroicons/react/outline';
import { ChevronDownIcon } from '@heroicons/react/solid';
import CategorySlider from '../../components/CategorySlider';
import Collection from '../../components/Collection';
import Footer from '../../components/Footer';
import Hero, { HeroContent } from '../../components/Hero';
import Layout, { LayoutMain, LayoutSidebar } from '../../components/Layout';
import Map from '../../components/Map';
import PostCard from '../../components/PostCard';
import SidebarDefault from '../../components/SidebarDefault';
import * as fragments from '../../config/fragments';
import getCategoryLink from '../../lib/getCategoryLink';
import getGQLClient from '../../lib/getGQLClient';

const Browse = ({
  ads,
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();
  const [showSubcats, setShowSubcats] = useState(false);
  const isHome = !router.query.browse;
  const { category, subcategory } = data;
  const coverImgSm =
    (subcategory ? subcategory.cover.small : category.cover.small) ||
    data.defaultImages?.cover.small;
  const coverImgLg =
    (subcategory ? subcategory.cover.large : category.cover.large) ||
    data.defaultImages?.cover.large;
  const showCollections =
    category && !subcategory && category.collections?.items;

  const archiveItems = useMemo(() => {
    if (showCollections) return [];
    const shuffledAds = _.shuffle(ads.collection);
    const mapPosts = post => ({
      type: 'post',
      data: post,
    });
    const posts = (subcategory || category).posts.nodes.filter(
      node => !!node.featuredImage,
    );
    const result = _.flatten(
      _.chunk(posts, 2).map((chunk, i) => {
        let result = chunk.map(mapPosts);
        if (i % 2 === 0 && shuffledAds.length > 0) {
          result.push({ type: 'ad', data: shuffledAds.pop() });
        }
        return result;
      }),
    );
    return result;
  }, [ads, category, subcategory, showCollections]);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      setShowSubcats(false);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Head>{htmlToReact(category.seo.fullHead)}</Head>
      {isHome ? (
        <CategorySlider data={category.slider} />
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
              {category.map?.mid && !subcategory && (
                <a
                  className="self-end hidden md:inline-flex lg:inline-flex my-2 md:my-0 md:order-1 items-end text-sm hover:underline"
                  href="#map">
                  <MapIcon className="w-5 h-5 mr-2" />
                  Jump to Map
                </a>
              )}
              {category.children.nodes.length > 0 && (
                <>
                  <div className="flex-auto w-full md:w-auto">
                    <button
                      className="relative btn justify-between h-11 w-full md:w-auto mt-3 rounded-full bg-opacity-25"
                      onClick={() => setShowSubcats(value => !value)}>
                      {showSubcats ? 'Hide' : 'Show'} subcategories…
                      <ChevronDownIcon
                        className={cx(
                          'w-4 h-4 ml-2 transition-duration-100',
                          showSubcats ? 'rotate-180' : 'rotate-0',
                        )}
                      />
                    </button>
                  </div>
                </>
              )}
            </div>
            {category.children.nodes.length > 0 && (
              <div
                className={cx(
                  'page-wrap pb-4 dark:pb-0 md:pr-24',
                  showSubcats ? '' : 'hidden',
                )}>
                {category.children.nodes
                  .filter(node => node.posts.nodes.length > 0)
                  .map(node => (
                    <Link key={node.uri} href={getCategoryLink(node.uri)}>
                      <a
                        className={cx(
                          'inline-flex items-center h-8 sm:h-10 mt-3 mr-1 px-3 rounded-full border bg-black leading-none whitespace-nowrap tracking-wide',
                          subcategory?.uri === node.uri
                            ? 'border-primary-400 border-opacity-75 text-primary-400'
                            : 'text-gray-300 hover:text-white border-white border-opacity-25',
                        )}>
                        {node.name}
                      </a>
                    </Link>
                  ))}
              </div>
            )}
          </HeroContent>
        </Hero>
      )}
      <Layout className={cx('py-px pb-14 xl:pb-0', isHome ? 'dark:pt-12' : '')}>
        <LayoutMain className="overflow-hidden pt-4">
          {showCollections ? (
            category.collections.items.map((item, index) => (
              <section className="my-6 md:my-12" key={item.title}>
                <div className="page-wrap flex items-baseline justify-between md:justify-start">
                  <h3 className="mb-2 font-display text-lg xs:text-xl sm:text-2xl lg:text-3xl 2xl:text-4xl">
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
                <Collection
                  ad={ads?.collection?.[index % ads.collection.length]}
                  key={item.title}
                  data={item}
                />
              </section>
            ))
          ) : (
            <div className="px-2 md:px-4 lg:px-8 py-6 grid gap-4 xl:gap-6 md:grid-cols-2">
              {archiveItems.map(item => (
                <PostCard
                  {...(item.type === 'ad'
                    ? { ad: item.data }
                    : { post: item.data })}
                />
              ))}
            </div>
          )}
          {category.map?.mid && (
            <section className="lg:mb-8 lg:px-8">
              <Map data={category.map} />
            </section>
          )}
        </LayoutMain>
        <LayoutSidebar className="xl:bg-gradient-to-r from-gray-100 via-gray-100 dark:xl:bg-none">
          <SidebarDefault className="!pt-10" data={data} />
          <Footer data={data} />
        </LayoutSidebar>
      </Layout>
    </>
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
  const api = getGQLClient('user');
  const data = await api.request(query);
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
        ads {
          collection {
            body
            code
            enabled
            heading
            position
            cta {
              url
              title
            }
            image {
              altText
              srcLarge: sourceUrl(size: LARGE)
            }
          }
        }
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
            ...CollectionData
          }
        }
        map {
          ...MapData
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
          ...CategorySliderData
        }
        ...CategoryData
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
    ${fragments.BlockData}
    ${fragments.CategorySliderData}
    ${fragments.CollectionData}
    ${fragments.FooterData}
    ${fragments.HeroImageData}
    ${fragments.MapData}
    ${fragments.PostCardData}
    ${fragments.PostMediaBlockData}
    ${fragments.SidebarDefaultData}
  `;

  const categorySlug = params.browse?.[0] ?? 'features-guides';
  const subcategorySlug = params.browse?.[1] ?? '';

  // Fire the request
  // Important!: "admin" role is required for preview mode
  const api = getGQLClient(preview ? 'preview' : 'admin');
  const data = await api.request(query, {
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

  // console.log(JSON.stringify(data.category?.ads.collection, null, 2));

  return {
    notFound: !data.category,
    props: {
      ads: preview
        ? {
            collection: _.fill(Array(2), {
              body: 'This is the ad body content. Use this to describe your product or service.',
              enabled: true,
              heading: 'Post Tile Banner [$250/month] [1:1]',
              position: 3,
              cta: {
                title: 'Call to Action',
                url: 'https://www.vietnamcoracle.com',
              },
              image: {
                altText: '',
                srcLarge: 'https://via.placeholder.com/1024x1024?text=%20',
              },
            }),
          }
        : data.category.ads,
      data,
      preview,
    },
    revalidate: 60,
  };
};

export default Browse;
