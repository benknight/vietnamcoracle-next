import { request, gql } from 'graphql-request';
import _ from 'lodash';
import { useRouter } from 'next/router';
import PostCard from '../../components/PostCard';

const Category = ({ data }) => {
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  const { category: cat } = data;
  return (
    <div className="page-wrap">
      <h1 className="page-heading">{cat.name}</h1>
      <ul>
        {cat.posts.nodes.map(post => (
          <PostCard post={post} />
        ))}
      </ul>
    </div>
  );
};

export async function getStaticPaths() {
  const query = gql`
    {
      destinations: category(id: "destinations", idType: SLUG) {
        ...CategoryData
      }
      food: category(id: "food-and-drink", idType: SLUG) {
        ...CategoryData
      }
      guides: category(id: "motorbike-guides", idType: SLUG) {
        ...CategoryData
      }
      hotels: category(id: "hotel-reviews", idType: SLUG) {
        ...CategoryData
      }
    }
    fragment CategoryData on Category {
      id
      name
      children(first: 1000) {
        nodes {
          slug
        }
      }
    }
  `;
  const data = await request(process.env.WORDPRESS_API_URL, query);
  return {
    paths: [
      ...data.destinations.children.nodes,
      ...data.food.children.nodes,
      ...data.guides.children.nodes,
      ...data.hotels.children.nodes,
    ].map(node => ({
      params: { category: node.slug },
    })),
    fallback: false,
  };
}

export async function getStaticProps({
  params: { category },
  preview = false,
}) {
  const query = gql`
    query Category($slug: ID!) {
      category(id: $slug, idType: SLUG) {
        id
        name
        posts(first: 100) {
          nodes {
            ...PostCardPostData
          }
        }
      }
    }
    ${PostCard.fragments}
  `;
  const data = await request(process.env.WORDPRESS_API_URL, query, {
    slug: category,
  });
  // TODO: processImages(data);
  return {
    props: { data, preview },
  };
}

export default Category;
