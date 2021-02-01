import cx from 'classnames';
import { gql } from 'graphql-request';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout, { LayoutMain } from '../components/Layout';
import Hero from '../components/Hero';
import SidebarDefault from '../components/SidebarDefault';
import getAPIClient from '../lib/getAPIClient';
import useWaitCursor from '../lib/useWaitCursor';

const PostOrPage = ({ data }) => {
  const router = useRouter();
  useWaitCursor(router.isFallback);

  if (router.isFallback) {
    return null;
  }

  if (!data) {
    return;
  }

  return (
    <>
      <Head>
        <title>{data.contentNode.title}</title>
      </Head>
      <Hero
        imgSm={data.contentNode.thumbnails?.thumbnailSquare}
        imgLg={data.contentNode.featuredImage?.node}>
        <h1
          className={cx(
            'mt-12 mb-2 xl:pl-8 xl:pr-60 font-display leading-tight',
            {
              'text-4xl lg:text-5xl': data.contentNode.title.length <= 40,
              'text-4xl': data.contentNode.title.length > 40,
            },
          )}
          id="top">
          {data.contentNode.title}
        </h1>
      </Hero>
      <Layout>
        <LayoutMain>
          <div className="pt-1 px-4 md:px-8 lg:px-8 xl:pl-20 xl:pr-20 text-lg max-w-5xl">
            <div
              className="post"
              dangerouslySetInnerHTML={{ __html: data.contentNode.content }}
            />
          </div>
        </LayoutMain>
        <SidebarDefault data={data} />
      </Layout>
    </>
  );
};

export function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export async function getStaticProps({ params: { node }, preview = false }) {
  const query = gql`
    query PageOrPost($preview: Boolean!, $slug: ID!) {
      contentNode(id: $slug, idType: URI) {
        ... on Page {
          content
          title
          featuredImage {
            node {
              sourceUrl
              mediaDetails {
                height
                width
              }
            }
          }
        }
        ... on Post {
          content
          title
          featuredImage {
            node {
              sourceUrl
              mediaDetails {
                height
                width
              }
            }
          }
          thumbnails {
            thumbnailSquare {
              sourceUrl
              mediaDetails {
                height
                width
              }
            }
          }
        }
      }
      ...SidebarDefaultData
    }
    ${SidebarDefault.fragments}
  `;
  const client = await getAPIClient();
  const data = await client.request(query, {
    preview,
    slug: node,
  });
  return {
    notFound: !data.contentNode,
    props: {
      data,
      preview,
    },
  };
}

export default PostOrPage;
