export default function cleanPostHTML(html: string): string {
  let result = html;

  // Force https
  result = result.replace(/(http)\:\/\//gm, 'https://');

  // Set language to English on all embeded maps
  result = result.replace(
    /(google\.com\/maps\/d\/embed([\?&][\w-\.]+=[\w-\.]+)+)/g,
    '$1&hl=en',
  );

  return result;
}
