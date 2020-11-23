import fs from 'fs';
import { request, gql } from 'graphql-request';
import jimp from 'jimp/es';
import path from 'path';

export default async function blurImages() {
  const data = await request(
    process.env.WORDPRESS_API_URL,
    gql`
      {
        components {
          nodes {
            collections {
              items {
                category {
                  posts {
                    nodes {
                      ...PostImageData
                    }
                  }
                }
                posts {
                  ... on Post {
                    ...PostImageData
                  }
                }
              }
            }
          }
        }
      }
      fragment PostImageData on Post {
        thumbnails {
          thumbnailSquare {
            id
            sourceUrl(size: MEDIUM)
            slug
          }
        }
      }
    `,
  );
  const thumbnails = [];
  data.components.nodes.forEach(component => {
    component.collections.items?.forEach(item => {
      [...(item.category?.posts.nodes ?? []), ...(item.posts || [])].forEach(
        post => {
          thumbnails.push(post.thumbnails.thumbnailSquare);
        },
      );
    });
  });
  for (let i = 0; i < thumbnails.length; i++) {
    const { sourceUrl, slug } = thumbnails[i];
    const pathToImage = path.join(process.cwd(), `public/fx/${slug}.jpg`);
    if (!fs.existsSync(pathToImage)) {
      console.log(`Generating blurred image for thumbnail ${slug}...`);
      try {
        const image = await jimp.read(sourceUrl);
        image.gaussian(50);
        await image.writeAsync(pathToImage);
      } catch (error) {
        console.error(error);
        return;
      }
    }
  }
  return;
}
