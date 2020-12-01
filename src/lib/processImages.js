import fs from 'fs';
import jimp from 'jimp/es';
import _ from 'lodash';
import vibrant from 'node-vibrant';
import path from 'path';

const pathToJSON = path.join(process.cwd(), 'src/json');
const pathToSwatches = path.join(pathToJSON, 'swatches.json');

if (!fs.existsSync(pathToJSON)) {
  fs.mkdirSync(pathToJSON);
}

function getPathToImage(slug) {
  return path.join(process.cwd(), `public/fx/${slug}.jpg`);
}

export default async function processImages(data) {
  const dataAsString = JSON.stringify(data);
  let thumbnails = dataAsString.match(
    /\{[^\{]*"__typename":\s*"MediaItem"[^\}]*\}/g,
  );
  if (!thumbnails) return;
  thumbnails = thumbnails.map(match => JSON.parse(match));

  // Generate swatches
  let swatches;
  try {
    swatches = JSON.parse(fs.readFileSync(pathToSwatches));
  } catch (error) {
    swatches = {};
  }
  const swatchesQueue = thumbnails.filter(thumbnail => !swatches[thumbnail.id]);
  for (let i = 0; i < swatchesQueue.length; i++) {
    const progress = `[${i + 1}/${swatchesQueue.length}]`;
    const image = swatchesQueue[i];
    const { id } = image;
    const sourceUrl = image.processImagesSourceUrl || image.sourceUrl;
    console.log(
      `${progress} Generating color swatches for thumbnail ${sourceUrl}...`,
    );
    const palette = await vibrant.from(sourceUrl).getPalette();
    swatches[id] = _.mapValues(palette, swatch => ({
      bodyTextColor: swatch.getBodyTextColor(),
      hex: swatch.getHex(),
      titleTextColor: swatch.getTitleTextColor(),
    }));
  }
  fs.writeFileSync(pathToSwatches, JSON.stringify(swatches));

  // Generate blurred images
  const imagesQueues = thumbnails.filter(
    thumbnail => !fs.existsSync(getPathToImage(thumbnail.slug)),
  );
  for (let i = 0; i < imagesQueues.length; i++) {
    const progress = `[${i + 1}/${imagesQueues.length}]`;
    const image = imagesQueues[i];
    const { slug } = image;
    const sourceUrl = image.processImagesSourceUrl || image.sourceUrl;
    console.log(
      `${progress} Generating blurred image for thumbnail ${sourceUrl}...`,
    );
    const pathToImage = path.join(process.cwd(), `public/fx/${slug}.jpg`);
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
