import * as cheerio from 'cheerio';
import { differenceInMonths, parse } from 'date-fns';
import cleanPostHTML from './cleanPostHTML';
import cmsToNextUrls from './cmsToNextUrls';
import getOldPostAlertHtml from './getOldPostAlertHtml';
import SidebarDefault from '../components/SidebarDefault';

export default async function preparePostData(
  data: any,
  blockData: React.ComponentProps<typeof SidebarDefault>['blocks'],
  preview: boolean,
) {
  if (preview) {
    if (data.contentNode) {
      data.contentNode = {
        ...data.contentNode,
        ...data.contentNode.preview?.node,
      };
    }
  }

  let postNav: string[][] = [];
  let monthsOld: number = -1;

  if (!data.contentNode?.content) {
    throw new Error('No post content found');
  }

  let html = cleanPostHTML(data.contentNode.content);

  const $ = cheerio.load(html, null, false);

  const lastUpdated = $(
    "p:first-of-type:contains('Last updated'), p:first-of-type:contains('Last Updated'), p:first-of-type:contains('First published'), p:first-of-type:contains('First Published')",
  );

  if (lastUpdated.length > 0) {
    lastUpdated.addClass('!font-display text-sm !my-4 !m-0 !text-left');

    const { commentCount } = data.contentNode;
    if (commentCount > 0) {
      lastUpdated.append(
        ` | <a href="#comments">${commentCount} ${
          commentCount > 1 ? 'comments' : 'comment'
        }</a>`,
      );
    }

    const date = lastUpdated
      .text()
      .match(/(Last\s+updated|First\s+published)\s+([^|]+)/i)?.[2]
      ?.trim()
      .replace(/\s+/g, ' ');

    if (date) {
      const parsed = parse(date, 'LLLL yyyy', new Date());
      monthsOld = differenceInMonths(new Date(), parsed);

      if (monthsOld > 36) {
        $(getOldPostAlertHtml(monthsOld)).insertAfter(lastUpdated);
      }
    }
  }

  if (data.contentNode.status === 'publish') {
    const html = '<div class="mt-4 mb-8"><share-buttons /></div>';

    if (lastUpdated.length > 0) {
      $(html).insertAfter(lastUpdated);
    } else {
      $.root().prepend(html);
    }
  }

  // Pass post data to share buttons
  $('share-buttons').attr({
    'data-title': data.contentNode.title,
    'data-link': cmsToNextUrls(data.contentNode.link),
    'data-image': data.contentNode.featuredImage?.node.sourceUrl ?? '',
  });

  // Lazy load all iframes
  $('iframe').attr({ loading: 'lazy' });

  // Add rel="sponsored noopener" to any links with gofollow class
  $('a.gofollow').attr({
    rel: 'sponsored noopener',
  });

  // Add overlay to Google Maps embeds
  $('iframe')
    .filter(function () {
      return /(google(\.[\w]+)+\/maps[\/\w-\.]+\/embed([\?&][\w-\.]+=[\w-\.]+)+)/g.test(
        $(this).attr('src') || '',
      );
    })
    .replaceWith(function () {
      return $('<map-overlay />').attr({
        'data-height': $(this).attr('height') || '',
        'data-src': $(this).attr('src') || '',
        'data-title': $(this).attr('title') || '',
        'data-width': $(this).attr('width') || '',
        'data-blockDescription': blockData.support.block.description,
        'data-blockImage': blockData.about.block.image.sourceUrl,
        'data-blockTitle': blockData.support.block.title,
      });
    });

  // Generate contents menu
  const internalLinks = $(
    data.contentNode?.settings?.useNextStyles
      ? '.wp-block-buttons:first-of-type .wp-block-button__link'
      : 'h2 strong a',
  );

  if (internalLinks.length) {
    postNav = [
      ...internalLinks
        .toArray()
        .map(element => [
          $(element).attr('href') || '',
          $(element).text() || '',
        ]),
    ];
  }

  // Remove "Back Top" link after related posts
  $('related-posts')?.parent().next('p:has(a[href="#top"])').remove();

  // Put agoda inside iframe
  $('div[id^="adgshp"]').each((_i, element) => {
    const scriptTags = [
      ...$(element).nextAll('script').toArray(),
      ...$(element).next('p').find('script').toArray(),
    ];

    const html =
      $('<div />')
        .append($(element).clone(), $(scriptTags).clone())
        .html()
        ?.replace('<br />', '') ?? '';

    $(element).replaceWith(
      `<iframe src="/api/iframe-service/?html=${encodeURIComponent(
        html,
      )}" height="500" title="Book your accommodation"></iframe>`,
    );

    $(scriptTags).remove();
  });

  // Fix captions
  $('p > a[href$=".jpg"]:first-child').each((_i, element) => {
    if (!element.parent) {
      return;
    }

    $(element.parent).addClass('text-sm text-center legacy-caption mb-8');
    $(element).addClass('post-image').insertBefore(element.parent);
  });

  html = $.html();

  return {
    ads: preview
      ? {
          header: {
            enabled: true,
            html: `<a class="preview-placement" href="https://www.vietnamcoracle.com/" title="Header Banner [$500/month] [2:1]"><img alt="" src="https://cms.vietnamcoracle.com/wp-content/uploads/2022/08/placeholder200x100.png"></a>`,
          },
        }
      : {
          header:
            data.contentNode.categories?.nodes.find(
              node => node.ads?.header?.enabled,
            )?.ads.header ?? null,
        },
    contentNode: data.contentNode,
    contentType: data.contentNode.contentType.node.name,
    heroImage: {
      small:
        data.contentNode.thumbnails?.thumbnailHeaderSquare ??
        data.contentNode.featuredImage?.node ??
        data.defaultImages?.cover.small,
      large:
        data.contentNode.thumbnails?.thumbnailHeader ??
        data.defaultImages?.cover.large,
    },
    html,
    monthsOld,
    navCategory: data.contentNode?.navCategory?.nodes?.[0]?.slug ?? null,
    postNav,
    preview,
    title: data.contentNode.title.replace(/\s+(\S*)$/, '\u00A0$1'),
  };
}
