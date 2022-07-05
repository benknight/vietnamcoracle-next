import { gql } from 'graphql-request';
import htmlToReact from 'html-react-parser';
import _ from 'lodash';
import type { InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import Footer from '../../components/Footer';
import GridListTab from '../../components/GridListTab';
import Hero, { HeroContent } from '../../components/Hero';
import Layout, { LayoutMain, LayoutSidebar } from '../../components/Layout';
import SidebarDefault from '../../components/SidebarDefault';
import * as fragments from '../../config/fragments';
import getGQLClient from '../../lib/getGQLClient';

const Tag = ({ data }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const coverImgSm = data.tag.cover?.small || data.defaultImages?.cover.small;
  const coverImgLg = data.tag.cover?.large || data.defaultImages?.cover.large;
  return (
    <>
      <Head>{htmlToReact(data.tag.seo.fullHead)}</Head>
      <Hero imgSm={coverImgSm} imgLg={coverImgLg} theme="dark">
        <HeroContent>
          <div className="page-wrap">
            <h1 className="font-display text-2xl md:text-3xl lg:text-3xl leading-tight">
              Posts tagged <i>“{data.tag.name}”</i>
            </h1>
          </div>
        </HeroContent>
      </Hero>
      <Layout className="bg-white dark:bg-gray-950 pb-14 xl:pb-0">
        <LayoutMain>
          <GridListTab.Group posts={data.tag.posts.nodes} />
        </LayoutMain>
        <LayoutSidebar>
          <SidebarDefault data={data} />
          <Footer data={data} />
        </LayoutSidebar>
      </Layout>
    </>
  );
};

export const getStaticPaths = async () => {
  const query = gql`
    {
      tags(first: 10, where: { orderby: COUNT, order: DESC }) {
        nodes {
          uri
        }
      }
    }
  `;
  const api = getGQLClient('user');
  const data = await api.request(query);
  const result = {
    paths: [
      ...data.tags.nodes.map(tag => ({
        params: { tag: tag.uri.split('/').filter(token => Boolean(token))[1] },
      })),
    ],
    fallback: 'blocking',
  };
  return result;
};

export const getStaticProps = async ({ params, preview = false }) => {
  const query = gql`
    query Tag($preview: Boolean!, $slug: ID!) {
      tag(id: $slug, idType: SLUG) {
        name
        slug
        cover {
          small {
            ...HeroImageData
          }
          large {
            ...HeroImageData
          }
        }
        posts(first: 1000) {
          nodes {
            slug
            ...PostCardData
            ...PostMediaBlockData
          }
        }
        seo {
          fullHead
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
    ${fragments.BlockData}
    ${fragments.FooterData}
    ${fragments.HeroImageData}
    ${fragments.PostCardData}
    ${fragments.PostMediaBlockData}
    ${fragments.SidebarDefaultData}
  `;

  const api = getGQLClient(preview ? 'preview' : 'admin');

  const data = await api.request(query, {
    preview,
    slug: encodeURIComponent(params.tag),
  });

  return {
    props: {
      data,
      preview,
    },
    // Disabling to avoid overage charges, replace with on-demand revalidation
    // revalidate: 60,
  };
};

export default Tag;
