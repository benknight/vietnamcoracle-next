import { request, gql } from 'graphql-request';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Layout, { LayoutMain } from '../components/Layout';
import SidebarDefault from '../components/SidebarDefault';

const Post = ({ data }) => {
  const router = useRouter();
  useEffect(() => {
    window.document.querySelector('body').style.cursor = router.isFallback
      ? 'wait'
      : '';
  }, [router.isFallback]);
  if (router.isFallback) {
    return null;
  }
  return (
    <Layout>
      <LayoutMain>
        <div className="p-12 bg-white text-gray-700 text-lg">
          <h1>{data?.post.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: data?.post.content }} />
        </div>
      </LayoutMain>
      <SidebarDefault data={data} />
    </Layout>
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
    query Post($slug: ID!) {
      ...SidebarDefaultData
      post(id: $slug, idType: SLUG) {
        content
        title
      }
    }
    ${SidebarDefault.fragments}
  `;
  const data = await request(process.env.WORDPRESS_API_URL, query, {
    slug: post,
  });
  return {
    props: { data, preview },
  };
}

export default Post;
