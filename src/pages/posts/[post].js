import { request, gql } from 'graphql-request';
import { useRouter } from 'next/router';
import React from 'react';

const Post = ({ data: { post } }) => {
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  return (
    <div className="p-12 bg-white text-gray-700 text-lg">
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
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
      post(id: $slug, idType: SLUG) {
        content
        title
      }
    }
  `;
  const data = await request(process.env.WORDPRESS_API_URL, query, {
    slug: post,
  });
  return {
    props: { data, preview },
  };
}

export default Post;
