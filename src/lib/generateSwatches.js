import fs from 'fs';
import { request, gql } from 'graphql-request';
import _mapValues from 'lodash/mapValues';
import vibrant from 'node-vibrant';
import path from 'path';

const pathToJSON = path.join(process.cwd(), 'src/json');
const pathToSwatches = path.join(pathToJSON, 'swatches.json');

if (!fs.existsSync(pathToJSON)) {
  fs.mkdirSync(pathToJSON);
}

export default async function getSwatches(thumbnails) {
  let swatches;
  try {
    swatches = JSON.parse(fs.readFileSync(pathToSwatches));
  } catch (error) {
    swatches = {};
  }
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
    const { id, sourceUrl } = thumbnails[i];
    if (!swatches[id]) {
      console.log(`Generating color swatches for thumbnail ${id}...`);
      const palette = await vibrant.from(sourceUrl).getPalette();
      swatches[id] = _mapValues(palette, swatch => ({
        bodyTextColor: swatch.getBodyTextColor(),
        hex: swatch.getHex(),
        titleTextColor: swatch.getTitleTextColor(),
      }));
    }
  }
  fs.writeFileSync(pathToSwatches, JSON.stringify(swatches));
  return swatches;
}
