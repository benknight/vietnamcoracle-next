export default function cleanPostHTML(html: string): string {
  let result = html;

  // Force https
  result = result.replace(/(http)\:\/\//gm, 'https://');

  // Set language to English on all embeded maps
  result = result.replace(
    /(google\.com\/maps\/d\/embed([\?&][\w-\.]+=[\w-\.]+)+)/g,
    '$1&hl=en',
  );

  // Replace raw shortcodes with custom HTML elements
  // Regex: https://regexr.com/39upv
  result = result.replace(
    /\[(mc4wp_form)(?=\s|\])(.*?)]((.*?)\[\/\1])?/g,
    '<shortcode-$1 $2>$4</shortcode-$1>',
  );

  return result;
}
