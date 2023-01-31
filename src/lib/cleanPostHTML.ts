import cmsToNextUrls from './cmsToNextUrls';

export default function cleanPostHTML(html: string): string {
  let result = html;

  // Force https
  result = result.replace(/(http)\:\/\//gm, 'https://');

  // Set language to English on all embeded maps
  result = result.replace(
    /(google\.com\/maps[\/\w-\.]+\/embed([\?&][\w-\.]+=[\w-\.]+)+)/g,
    '$1&hl=en&ehbc=57534e',
  );

  // Replace mc4wp_form shorcode with <subscribe-form>
  // Regex: https://regexr.com/39upv
  result = result.replace(
    /\[(mc4wp_form)(?=\s|\])(.*?)]((.*?)\[\/\1])?/g,
    '<subscribe-form $2>$4</subscribe-form>',
  );

  // Replace shareaholic shorcode with <share-buttons>
  result = result.replace(
    /\[(shareaholic)(?=\s|\])(.*?)]((.*?)\[\/\1])?/g,
    `<share-buttons $2>$4</share-buttons>`,
  );

  // Replace custom-related-posts shorcode with <related-posts>
  result = result.replace(
    /\[(custom-related-posts)(?=\s|\])(.*?)]((.*?)\[\/\1])?/g,
    '<related-posts $2>$4</related-posts>',
  );

  result = cmsToNextUrls(result);

  return result;
}
