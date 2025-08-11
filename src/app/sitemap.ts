import { gql } from 'graphql-request';
import type { MetadataRoute } from 'next';
import WPGraphQLClient from '../lib/WPGraphQLClient';
import cmsToNextUrls from '../lib/cmsToNextUrls';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const api = new WPGraphQLClient('admin');

  const data = await api.request(gql`
    {
      posts: contentNodes(
        first: 10000
        where: {
          contentTypes: [PAGE, POST]
          orderby: { field: COMMENT_COUNT, order: DESC }
        }
      ) {
        nodes {
          modifiedGmt
          seo {
            canonical
          }
        }
      }
      categories(
        first: 1000
        where: {
          slug: [
            "motorbike-guides"
            "food-and-drink"
            "hotel-reviews"
            "destinations"
          ]
        }
      ) {
        nodes {
          seo {
            canonical
          }

          children(first: 1000) {
            nodes {
              seo {
                canonical
              }
            }
          }
        }
      }
      tags(
        first: 1000
        where: { orderby: COUNT, order: DESC, hideEmpty: true }
      ) {
        nodes {
          slug
        }
      }
    }
  `);

  const sitemap: MetadataRoute.Sitemap = [
    {
      url: 'https://www.vietnamcoracle.com/',
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];

  data.categories.nodes.forEach(category => {
    sitemap.push({
      url: cmsToNextUrls(category.seo.canonical),
      changeFrequency: 'weekly',
      priority: 1,
    });

    category.children.nodes.forEach(subcategory => {
      sitemap.push({
        url: cmsToNextUrls(subcategory.seo.canonical),
        changeFrequency: 'weekly',
        priority: 0.5,
      });
    });
  });

  data.posts.nodes.forEach((node, index) => {
    sitemap.push({
      url: cmsToNextUrls(node.seo.canonical),
      lastModified: new Date(`${node.modifiedGmt}Z`),
      changeFrequency: 'yearly',
      priority:
        index <= 50 ? 0.7 : index <= 100 ? 0.6 : index <= 200 ? 0.5 : 0.4,
    });
  });

  data.tags.nodes.forEach(tag => {
    sitemap.push({
      url: cmsToNextUrls(`https://www.vietnamcoracle.com/tag/${tag.slug}/`),
      changeFrequency: 'monthly',
      priority: 0.3,
    });
  });

  // return [
  //   {
  //     url: 'https://acme.com',
  //     lastModified: new Date(),
  //     changeFrequency: 'yearly',
  //     priority: 1,
  //   },
  //   {
  //     url: 'https://acme.com/about',
  //     lastModified: new Date(),
  //     changeFrequency: 'monthly',
  //     priority: 0.8,
  //   },
  //   {
  //     url: 'https://acme.com/blog',
  //     lastModified: new Date(),
  //     changeFrequency: 'weekly',
  //     priority: 0.5,
  //   },
  // ];

  return sitemap;
}
