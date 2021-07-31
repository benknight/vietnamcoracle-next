import vibrant from 'node-vibrant';

export default async function generateSwatches(
  json: string,
): Promise<{ [key: string]: string }> {
  let swatches = {};
  if (process.env.NODE_ENV === 'production') {
    const thumbnails = (
      json.match(/\{[^\{]*"__typename":\s*"MediaItem"[^\}]*\}/g) || []
    ).map(match => JSON.parse(match));
    const results = (
      await Promise.all(
        thumbnails.map(t =>
          vibrant
            .from(
              `https://res.cloudinary.com/vietnam-coracle/image/fetch/a_vflip,c_fill,e_blur:2000,g_north,h_75,w_150/${t.srcFx}`,
            )
            .getPalette(),
        ),
      )
    ).map(palette => palette.DarkMuted.hex);
    for (let i = 0; i < thumbnails.length; i++) {
      swatches[thumbnails[i].id] = results[i];
    }
  }
  return swatches;
}
