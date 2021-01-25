import cx from 'classnames';
import { request, gql } from 'graphql-request';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout, { LayoutMain } from '../components/Layout';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import SidebarDefault from '../components/SidebarDefault';
import useWaitCursor from '../lib/useWaitCursor';

const Post = ({ data }) => {
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
        <title>{data.post.title}</title>
      </Head>
      <Hero
        imgSm={data.post.thumbnails.thumbnailSquare}
        imgLg={data.post.featuredImage?.node}>
        <h1
          className={cx(
            'mt-12 mb-2 xl:pl-8 xl:pr-60 font-display leading-tight',
            {
              'text-4xl lg:text-5xl': data.post.title.length <= 40,
              'text-3xl lg:text-4xl': data.post.title.length > 40,
            },
          )}
          id="top">
          {data.post.title}
        </h1>
      </Hero>
      <Layout>
        <LayoutMain>
          <div className="pt-1 px-4 md:px-8 lg:px-8 xl:pl-20 xl:pr-20 text-lg max-w-5xl">
            <div
              className="post"
              dangerouslySetInnerHTML={{ __html: data.post.content }}
            />
          </div>
        </LayoutMain>
        <SidebarDefault data={data} />
      </Layout>
      <Footer data={data} />
    </>
  );
};

export function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export async function getStaticProps({ params: { post }, preview = false }) {
  const query = gql`
    query Post($preview: Boolean!, $slug: ID!) {
      post(id: $slug, idType: SLUG) {
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
      ...FooterData
      ...SidebarDefaultData
    }
    ${Footer.fragments}
    ${SidebarDefault.fragments}
  `;
  const data = await request(process.env.WORDPRESS_API_URL, query, {
    preview,
    slug: post,
  });
  return {
    notFound: !data.post,
    props: {
      data,
      preview,
    },
  };
}

export default Post;
