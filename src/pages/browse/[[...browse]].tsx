import cx from 'classnames';
import { gql } from 'graphql-request';
import htmlToReact from 'html-react-parser';
import _ from 'lodash';
import type { InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { ArrowRightIcon, MapIcon } from '@heroicons/react/outline';
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
import cmsToNextUrls from '../../lib/cmsToNextUrls';
import getCategoryLink from '../../lib/getCategoryLink';
import getGQLClient from '../../lib/getGQLClient';

const Browse = ({
  ads,
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();
  const [showSubcats, setShowSubcats] = useState(true);
  const { category, subcategory } = data;
  const isHome = category.slug === 'features-guides';
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
      <Head>
        {htmlToReact(
          cmsToNextUrls((subcategory || category).seo.fullHead).replace(
            /\/category\/features-guides\//g,
            '/browse/',
          ),
        )}
      </Head>
      {isHome ? (
        <CategorySlider data={category.slider} />
      ) : (
        <Hero imgSm={coverImgSm} imgLg={coverImgLg} theme="dark">
          <HeroContent>
            <div className="page-wrap pb-4 flex-auto flex flex-wrap md:flex-nowrap items-end">
              <h1 className="mt-8 sm:mr-6 font-display">
                {subcategory ? (
                  <div className="text-2xl sm:text-3xl lg:text-4xl leading-normal sm:leading-tight">
                    <span className="inline-block text-gray-300 opacity-90">
                      <Link href={getCategoryLink(category.uri)}>
                        <a className="inline-block hover:link">
                          {category.name}{' '}
                        </a>
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
                  className="self-end hidden md:inline-flex lg:inline-flex my-2 md:mb-1 md:order-1 items-end text-sm hover:underline"
                  href="#map">
                  <MapIcon className="w-5 h-5 mr-2" />
                  Jump to Map
                </a>
              )}
              {category.children.nodes.length > 0 && (
                <div className="flex-auto w-full md:hidden">
                  <button
                    className="relative btn justify-between h-11 w-full mt-3 rounded-full bg-opacity-25"
                    onClick={() => setShowSubcats(value => !value)}>
                    {showSubcats
                      ? subcategory
                        ? 'Show Less'
                        : 'Hide Subcategories'
                      : subcategory
                      ? 'Show More'
                      : 'Show Subcategories'}
                    <ChevronDownIcon
                      className={cx(
                        'w-4 h-4 ml-2 transition-duration-100',
                        showSubcats ? 'rotate-180' : 'rotate-0',
                      )}
                    />
                  </button>
                </div>
              )}
            </div>
            {category.children.nodes.length > 0 && (
              <div
                className={cx(
                  'page-wrap pb-4 dark:pb-0 md:pr-24',
                  showSubcats ? '' : 'hidden md:block',
                )}>
                {category.children.nodes.map(node => (
                  <Link
                    key={node.uri}
                    href={getCategoryLink(node.uri)}
                    scroll={false}>
                    <a
                      className={cx(
                        'inline-flex items-center h-8 mt-2 mr-1 px-3 rounded-full border bg-black leading-none whitespace-nowrap tracking-wide text-sm',
                        subcategory?.uri === node.uri
                          ? 'border-primary-400 border-opacity-75 text-primary-400'
                          : 'text-white border-white border-opacity-25 hover:border-opacity-50',
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
      <Layout className="py-px pb-14 xl:pb-0">
        <LayoutMain
          className={cx('overflow-hidden', isHome ? 'pt-8 md:pt-0' : 'pt-4')}>
          {showCollections ? (
            category.collections.items.map((item, index) => (
              <section className="my-6 md:my-12" key={item.title}>
                <div className="page-wrap flex items-baseline justify-between md:justify-start">
                  <h3 className="sm:mb-2 font-display sm:text-2xl 2xl:text-2xl dark:text-gray-200 group">
                    {item.category ? (
                      <Link href={getCategoryLink(item.category?.uri ?? '')}>
                        <a className="block group-hover:link">
                          {item.title} &gt;
                        </a>
                      </Link>
                    ) : (
                      item.title
                    )}
                  </h3>
                </div>
                <Collection
                  ad={ads?.collection?.[index % ads.collection.length]}
                  key={item.title}
                  data={item}
                />
              </section>
            ))
          ) : archiveItems.length > 0 ? (
            <div className="px-2 md:px-4 lg:px-8 py-6 grid gap-4 xl:gap-6 md:grid-cols-2">
              {archiveItems.map((item, index) => (
                <PostCard
                  inGrid
                  key={index}
                  {...(item.type === 'ad'
                    ? { ad: item.data }
                    : { post: item.data })}
                />
              ))}
            </div>
          ) : (
            <div className="py-48 font-display text-center">
              <h1 className="text-3xl mb-2 text-center">No posts to show</h1>
              This category is currently empty.
            </div>
          )}
          {category.map?.mid && (
            <section className="lg:mb-8 lg:px-8">
              <Map data={category.map} />
            </section>
          )}
        </LayoutMain>
        <LayoutSidebar>
          <SidebarDefault className="!pt-14" />
          <Footer />
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
    ${fragments.CategorySliderData}
    ${fragments.CollectionData}
    ${fragments.HeroImageData}
    ${fragments.MapData}
    ${fragments.PostCardData}
    ${fragments.PostMediaBlockData}
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
              body: 'This is the ad body content. Use this to describe your product or service. Spice it up with an image of your product.',
              enabled: true,
              heading: 'Title Banner [$250/month]',
              position: 3,
              cta: {
                title: 'Call to Action',
                url: 'https://www.vietnamcoracle.com',
              },
              image: {
                altText: '',
                srcLarge:
                  'https://cms.vietnamcoracle.com/wp-content/uploads/2022/09/placeholder-tile.png',
              },
            }),
          }
        : data.category.ads,
      data,
      preview,
    },
  };
};

export default Browse;
