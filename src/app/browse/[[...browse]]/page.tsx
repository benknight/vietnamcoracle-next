import cx from 'classnames';
import _ from 'lodash';
import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Fragment } from 'react';
import GraphQLClient from '../../../lib/WPGraphQLClient';
import getCategoryLink from '../../../lib/getCategoryLink';
import previewAds from '../../../lib/previewAds';
import cmsToNextUrls from '../../../lib/cmsToNextUrls';
import SidebarQuery from '../../../queries/Sidebar.gql';
import MenuQuery from '../../../queries/Menu.gql';
import Header from '../../../components/Header';
import Hero, { HeroContent } from '../../../components/Hero';
import Layout, { LayoutMain, LayoutSidebar } from '../../../components/Layout';
import PostCard from '../../../components/PostCard';
import SidebarDefault from '../../../components/SidebarDefault';
import Menu from '../../../components/Menu';
import getSEOMetadata from '../../../lib/getSEOMetadata';
import BrowseHero from './components/BrowseHero';
import CategoryMap from './components/CategoryMap';
import CategorySlider from './components/CategorySlider';
import Collection from './components/Collection';
import getPageData from './lib/getPageData';

export async function generateMetadata({ params }): Promise<Metadata> {
  const { browse } = await params;
  const { isEnabled: preview } = await draftMode();
  const pageData = await getPageData(browse, preview);

  if (!pageData?.category) {
    return notFound();
  }

  if (browse[1] && !pageData.subcategory) {
    return notFound();
  }

  return getSEOMetadata((pageData.subcategory || pageData.category).seo);
}

export const dynamic = 'force-static';

export const revalidate = false;

export async function generateStaticParams() {
  return [
    [],
    ['motorbike-guides'],
    ['food-and-drink'],
    ['hotel-reviews'],
    ['destinations'],
  ];
}

interface Props {
  params: Promise<{ browse: string[] }>;
}

export default async function Browse({ params }: Props) {
  const { browse } = await params;
  const { isEnabled: preview } = await draftMode();
  const api = new GraphQLClient(preview ? 'preview' : 'admin');

  const [pageData, blockData, menuData] = await Promise.all([
    getPageData(browse, preview),
    api.request(SidebarQuery),
    api.request(MenuQuery),
  ]);

  if (!pageData?.category) {
    return notFound();
  }

  if (browse[1] && !pageData.subcategory) {
    return notFound();
  }

  const isHome = pageData.category.slug === 'features-guides';

  const isMotorbikeGuides = pageData.category.slug === 'motorbike-guides';

  const coverImgSm =
    (pageData.subcategory
      ? pageData.subcategory.cover.small
      : pageData.category.cover.small) || pageData.defaultImages?.cover.small;

  const coverImgLg =
    (pageData.subcategory
      ? pageData.subcategory.cover.large
      : pageData.category.cover.large) || pageData.defaultImages?.cover.large;

  const showCollections =
    pageData.category &&
    !pageData.subcategory &&
    pageData.category.collections?.items;

  const ads = preview ? previewAds : pageData.category.ads;

  const archiveItems = (() => {
    if (showCollections) return [];

    const shuffledAds = _.shuffle(ads.collection?.filter(ad => ad.enabled));

    const mapPosts = post => ({
      type: 'post',
      data: post,
    });

    const posts = (
      pageData.subcategory || pageData.category
    ).posts.nodes.filter(node => !!node.featuredImage);

    const result = _.flatten(
      _.chunk(posts, 2).map((chunk, i) => {
        let result = chunk.map(mapPosts);
        if (i % 2 === 0 && shuffledAds.length > 0 && !isMotorbikeGuides) {
          result.push({ type: 'ad', data: shuffledAds.pop() });
        }
        return result;
      }),
    );

    return result;
  })();

  const navCategory = browse[0] === 'features-guides' ? undefined : browse[0];

  return (
    <div className="relative bg-white dark:bg-gray-950 min-h-screen">
      {pageData.category.seo?.schema?.raw && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: cmsToNextUrls(pageData.category.seo.schema.raw),
          }}
        />
      )}
      <Header
        menu={<Menu data={menuData} fullWidth />}
        navCategory={navCategory}
        preview={preview}
        fullWidth
      />
      {isHome ? (
        <CategorySlider data={pageData.category.slider} />
      ) : (
        <Hero imgSm={coverImgSm} imgLg={coverImgLg} priority theme="dark">
          <HeroContent theme="dark">
            <BrowseHero pageData={pageData} />
          </HeroContent>
        </Hero>
      )}
      <Layout className="py-px pb-14 xl:pb-0">
        <LayoutMain
          className={cx('overflow-hidden', isHome ? 'pt-8 md:pt-0' : 'pt-4')}>
          {showCollections ? (
            <>
              {isHome && ads.collection && !preview && (
                <Collection
                  heading="Offline Guides &amp; Maps"
                  items={ads.collection
                    .filter(ad => ad.enabled)
                    .map((ad, index) => (
                      <PostCard key={index} navCategory={navCategory} ad={ad} />
                    ))}
                />
              )}
              {isMotorbikeGuides && ads.collection && !preview && (
                <Collection
                  heading="Offline Guides &amp; Maps"
                  items={ads.collection
                    .filter(ad => ad.enabled)
                    .map((ad, index) => (
                      <PostCard key={index} navCategory={navCategory} ad={ad} />
                    ))}
                />
              )}
              {pageData.category.collections.items.map((collection, index) => {
                // Pick one ad to show for each collection, rotating through if there are more than one
                // If there is only one ad, show it every other row
                const ad =
                  ads.collection?.length === 1 && index % 2 === 1
                    ? null
                    : ads?.collection?.[index % ads.collection.length];

                const posts = collection.posts.filter(
                  post => !!post.featuredImage,
                );

                const mapPosts = post => ({
                  type: 'post',
                  data: post,
                });

                const items =
                  (isHome || isMotorbikeGuides || !ad?.enabled) && !preview
                    ? collection.posts.map(mapPosts)
                    : [
                        ...posts.slice(0, ad.position - 1).map(mapPosts),
                        { type: 'ad', data: ad },
                        ...posts.slice(ad.position - 1).map(mapPosts),
                      ];

                return (
                  <Fragment key={index}>
                    <Collection
                      heading={
                        collection.category ? (
                          <Link
                            href={getCategoryLink(
                              collection.category?.uri ?? '',
                            )}
                            className="block group-hover:link">
                            {collection.title} &gt;
                          </Link>
                        ) : (
                          collection.title
                        )
                      }
                      items={items.map((item, index) =>
                        item.type === 'ad' ? (
                          <PostCard
                            key={index}
                            ad={item.data}
                            navCategory={navCategory}
                          />
                        ) : (
                          <PostCard
                            key={index}
                            post={item.data}
                            navCategory={navCategory}
                          />
                        ),
                      )}
                    />
                  </Fragment>
                );
              })}
            </>
          ) : archiveItems.length > 0 ? (
            <div className="px-2 md:px-4 lg:px-8 py-6 grid gap-4 xl:gap-6 md:grid-cols-2 2xl:grid-cols-3">
              {archiveItems.map((item, index) => (
                <PostCard
                  inGrid
                  key={index}
                  navCategory={navCategory}
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
          {pageData.category.map?.mid && (
            <section className="lg:mb-8 lg:px-8">
              <CategoryMap
                aboutBlock={blockData.about.block}
                supportBlock={blockData.support.block}
                mapBlock={pageData.category.map}
                navCategory={navCategory}
              />
            </section>
          )}
        </LayoutMain>
        <LayoutSidebar className="xl:pt-14 xl:shadow-xl">
          <SidebarDefault blocks={blockData} />
        </LayoutSidebar>
      </Layout>
    </div>
  );
}
