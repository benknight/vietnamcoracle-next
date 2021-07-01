export default function getPostHTML(contentNode, fbShareCount: number): string {
  let result = contentNode.content;

  // Force https
  result = result.replace(/(http)\:\/\//gm, 'https://');

  // Set language to English on all embeded maps
  result = result.replace(
    /(google\.com\/maps\/d\/embed([\?&][\w-\.]+=[\w-\.]+)+)/g,
    '$1&hl=en',
  );

  // Replace mc4wp_form shorcode with <subscribe-form>
  // Regex: https://regexr.com/39upv
  result = result.replace(
    /\[(mc4wp_form)(?=\s|\])(.*?)]((.*?)\[\/\1])?/g,
    '<subscribe-form $2>$4</subscribe-form>',
  );

  // Replace shareaholic shorcode with <share-buttons>
  if (!contentNode.isRestricted) {
    result = result.replace(
      /\[(shareaholic)(?=\s|\])(.*?)]((.*?)\[\/\1])?/g,
      `<share-buttons
        data-share-count="${fbShareCount}"
        data-title="${contentNode.title}"
        data-link="${contentNode.link}"
        data-image="${contentNode.featuredImage?.node.sourceUrl}" $2>$4</share-buttons>`,
    );
  }

  // Replace custom-related-posts shorcode with <related-posts>
  result = result.replace(
    /\[(custom-related-posts)(?=\s|\])(.*?)]((.*?)\[\/\1])?/g,
    '<related-posts $2>$4</related-posts>',
  );

  return result;
}
