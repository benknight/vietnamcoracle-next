import cx from 'classnames';
import { gql } from 'graphql-request';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Hero from '../components/Hero';
import Layout, { LayoutMain, LayoutSidebar } from '../components/Layout';
import PostCard from '../components/PostCard';
import SidebarDefault from '../components/SidebarDefault';
import getAPIClient from '../lib/getAPIClient';
import useWaitCursor from '../lib/useWaitCursor';

function cleanPostHTML(html: string): string {
  let result = html;
  // Remove related posts heading
  result = result.replace(
    /<\s*h1(\s+.*?>|>).*?RELATED POSTS.*?<\s*\/\s*h1\s*>/gi,
    '',
  );
  return result;
}

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
        imgSm={data.contentNode.featuredImage?.node}
        imgLg={data.contentNode.thumbnails?.thumbnailHeader}>
        <h1
          className={cx(
            'mt-8 mb-2 xl:pl-8 xl:pr-60 font-display leading-tight',
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
              dangerouslySetInnerHTML={{
                __html: cleanPostHTML(data.contentNode.content),
              }}
            />
            {data.contentNode.customRelatedPosts && (
              <>
                <div className="page-heading">Related Posts:</div>
                <div className="py-8 grid gap-4 xl:gap-6 md:grid-cols-2 lg:grid-cols-2">
                  {data.contentNode.customRelatedPosts.nodes.map(post => (
                    <PostCard key={post.slug} post={post} flex />
                  ))}
                </div>
              </>
            )}
          </div>
        </LayoutMain>
        <LayoutSidebar className="bg-gray-100 dark:bg-gray-900">
          <SidebarDefault data={data} />
        </LayoutSidebar>
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
              ...HeroImageData
            }
          }
        }
        ... on Post {
          content
          title
          customRelatedPosts(first: 6) {
            nodes {
              ...PostCardPostData
            }
          }
          featuredImage {
            node {
              ...HeroImageData
            }
          }
          thumbnails {
            thumbnailHeader {
              ...HeroImageData
            }
          }
        }
      }
      ...SidebarDefaultData
    }
    ${Hero.fragments}
    ${PostCard.fragments}
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
