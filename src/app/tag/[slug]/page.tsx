import { Metadata } from 'next';
import { draftMode } from 'next/headers';
import Header from '../../../components/Header';
import Hero, { HeroContent } from '../../../components/Hero';
import Layout, { LayoutMain, LayoutSidebar } from '../../../components/Layout';
import { GridListTabGroup } from '../../../components/GridListTab';
import SidebarDefault from '../../../components/SidebarDefault';
import Footer from '../../../components/Footer';
import getGQLClient from '../../../lib/getGQLClient';
import getSEOMetadata from '../../../lib/getSEOMetadata';
import TagQuery from '../../../queries/Tag.gql';
import SidebarQuery from '../../../queries/Sidebar.gql';
import { Suspense } from 'react';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Tag({ params }: Props) {
  const { slug } = await params;
  const { isEnabled: preview } = await draftMode();

  const api = getGQLClient(preview ? 'preview' : 'admin');

  const [data, blockData] = await Promise.all([
    api.request(TagQuery, { slug }),
    api.request(SidebarQuery),
  ]);

  return (
    <div className="relative bg-white dark:bg-gray-950 min-h-screen">
      <Header preview={preview} />
      <Hero
        imgSm={data.tag.cover?.small || data.defaultImages?.cover.small}
        imgLg={data.tag.cover?.large || data.defaultImages?.cover.large}
        priority
        theme="dark">
        <HeroContent>
          <div className="page-wrap">
            <h1 className="font-display text-2xl md:text-3xl lg:text-3xl leading-tight pb-4 dark:pb-0">
              Posts tagged <i>“{data.tag.name}”</i>
            </h1>
          </div>
        </HeroContent>
      </Hero>
      <Layout className="bg-white dark:bg-gray-950 pb-14 xl:pb-0">
        <LayoutMain>
          <Suspense>
            <GridListTabGroup posts={data.tag.posts.nodes} />
          </Suspense>
        </LayoutMain>
        <LayoutSidebar>
          <SidebarDefault blocks={blockData} />
          <Footer />
        </LayoutSidebar>
      </Layout>
    </div>
  );
}

export async function generateMetadata({ params }): Promise<Metadata> {
  const { slug } = await params;
  const { isEnabled: preview } = await draftMode();

  try {
    const api = getGQLClient(preview ? 'preview' : 'admin');
    const data = await api.request(TagQuery, { slug });

    return getSEOMetadata(data.tag.seo);
  } catch (error) {
    console.error('Error generating metadata:', error);

    return {
      title: 'Error',
    };
  }
}
