import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import Header from '../../../components/Header';
import Hero, { HeroContent } from '../../../components/Hero';
import Layout, { LayoutMain, LayoutSidebar } from '../../../components/Layout';
import { GridListTabGroup } from '../../../components/GridListTab';
import SidebarDefault from '../../../components/SidebarDefault';
import GraphQLClient from '../../../lib/WPGraphQLClient';
import getSEOMetadata from '../../../lib/getSEOMetadata';
import TagQuery from '../../../queries/Tag.gql';
import SidebarQuery from '../../../queries/Sidebar.gql';
import MenuQuery from '../../../queries/Menu.gql';
import { Suspense } from 'react';
import Menu from '../../../components/Menu';
import cmsToNextUrls from '../../../lib/cmsToNextUrls';

export async function generateMetadata({ params }): Promise<Metadata> {
  const { slug } = await params;
  const { isEnabled: preview } = await draftMode();

  const api = new GraphQLClient(preview ? 'preview' : 'admin');
  const data = await api.request(TagQuery, { slug });

  if (!data?.tag) {
    return notFound();
  }

  return getSEOMetadata(data.tag.seo);
}

export const dynamic = 'force-static';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Tag({ params }: Props) {
  const { slug } = await params;
  const { isEnabled: preview } = await draftMode();

  const api = new GraphQLClient(preview ? 'preview' : 'admin');

  const [pageData, blockData, menuData] = await Promise.all([
    api.request(TagQuery, { slug }),
    api.request(SidebarQuery),
    api.request(MenuQuery),
  ]);

  if (!pageData?.tag) {
    return notFound();
  }

  return (
    <div className="relative bg-white dark:bg-gray-950 min-h-screen">
      {pageData.tag.seo?.schema?.raw && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: cmsToNextUrls(pageData.tag.seo.schema.raw),
          }}
        />
      )}
      <Header
        menu={<Menu data={menuData} fullWidth />}
        preview={preview}
        fullWidth
      />
      <Hero
        imgSm={pageData.tag.cover?.small || pageData.defaultImages?.cover.small}
        imgLg={pageData.tag.cover?.large || pageData.defaultImages?.cover.large}
        priority
        theme="dark">
        <HeroContent theme="dark">
          <div className="page-wrap">
            <h1 className="font-display text-2xl md:text-3xl lg:text-3xl leading-tight pb-4 dark:pb-0">
              Posts tagged <i>“{pageData.tag.name}”</i>
            </h1>
          </div>
        </HeroContent>
      </Hero>
      <Layout className="bg-white dark:bg-gray-950 pb-14 xl:pb-0">
        <LayoutMain>
          <Suspense>
            <GridListTabGroup posts={pageData.tag.posts.nodes} />
          </Suspense>
        </LayoutMain>
        <LayoutSidebar className="xl:pt-14 xl:shadow-xl">
          <SidebarDefault blocks={blockData} />
        </LayoutSidebar>
      </Layout>
    </div>
  );
}
