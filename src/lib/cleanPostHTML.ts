export default function cleanPostHTML(html: string): string {
  let result = html;

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
  );

  return result;
}
