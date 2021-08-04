import { gql } from 'graphql-request';
import htmlToReact from 'html-react-parser';
import _ from 'lodash';
import type { InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Footer from '../../components/Footer';
import GridListTab from '../../components/GridListTab';
import Hero, { HeroContent } from '../../components/Hero';
import PostCard, { SwatchesProvider } from '../../components/PostCard';
import PostMediaBlock from '../../components/PostMediaBlock';
import Layout, { LayoutMain, LayoutSidebar } from '../../components/Layout';
import SidebarDefault from '../../components/SidebarDefault';
import GraphQLClient from '../../lib/GraphQLClient';
import generateSwatches from '../../lib/generateSwatches';

const Tag = ({
  data,
  swatches,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();
  const coverImgSm = data.tag.cover?.small || data.defaultImages?.cover.small;
  const coverImgLg = data.tag.cover?.large || data.defaultImages?.cover.large;
  return (
    <SwatchesProvider value={swatches}>
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
      <Layout>
        <LayoutMain>
          <GridListTab.Group posts={data.tag.posts.nodes} />
        </LayoutMain>
        <LayoutSidebar showBorder>
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
      tags(first: 10, where: { orderby: COUNT, order: DESC }) {
        nodes {
          uri
        }
      }
    }
  `;
  const data = await GraphQLClient.request(query);
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
    ${Footer.fragments}
    ${Hero.fragments}
    ${PostCard.fragments}
    ${PostMediaBlock.fragments}
    ${SidebarDefault.fragments}
  `;

  const data = await GraphQLClient.request(query, {
    preview,
    slug: params.tag,
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

export default Tag;
