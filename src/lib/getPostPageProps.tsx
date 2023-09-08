import * as cheerio from 'cheerio';
import { differenceInMonths, parse } from 'date-fns';
import ReactDOMServer from 'react-dom/server';
import OldPostAlert from '../components/OldPostAlert';
import cleanPostHTML from './cleanPostHTML';
import cmsToNextUrls from './cmsToNextUrls';

type NavLinks = string[][];

export async function getPostPageProps(
  data: any,
  preview: boolean,
): Promise<{
  ads: any;
  data: any;
  html: string;
  monthsOld: number;
  navCategory?: string;
  postNav: any;
  preview: boolean;
}> {
  if (preview) {
    if (data.contentNode) {
      data.contentNode = {
        ...data.contentNode,
        ...data.contentNode.preview?.node,
      };
    }
  }

  let postNav: NavLinks = null;
  let html = '';
  let monthsOld: number = null;

  if (data.contentNode?.content) {
    html = cleanPostHTML(data.contentNode.content);
  }

  if (html) {
    const $ = cheerio.load(html);
    const lastUpdated = $(
      "p:first-of-type:contains('Last updated'), p:first-of-type:contains('Last Updated'), p:first-of-type:contains('First published'), p:first-of-type:contains('First Published')",
    );

    if (lastUpdated.length > 0) {
      lastUpdated.addClass('!font-display text-sm !my-4 !m-0 !text-left');
      const date = lastUpdated
        .text()
        .match(/(Last\s+updated|First\s+published)\s+([^|]+)/i)?.[2]
        ?.trim()
        .replace(/\s+/g, ' ');
      if (date) {
        const parsed = parse(date, 'LLLL yyyy', new Date());
        monthsOld = differenceInMonths(new Date(), parsed);
        if (monthsOld > 36) {
          $(
            ReactDOMServer.renderToStaticMarkup(
              <OldPostAlert className="mb-6 lg:mb-8" monthsOld={monthsOld} />,
            ),
          ).insertAfter(lastUpdated);
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

    // Add overlay to Google Maps embeds
    $('iframe')
      .filter(function () {
        return /(google\.com\/maps[\/\w-\.]+\/embed([\?&][\w-\.]+=[\w-\.]+)+)/g.test(
          $(this).attr('src'),
        );
      })
      .replaceWith(function () {
        return $('<map-overlay />').attr({
          'data-height': $(this).attr('height'),
          'data-src': $(this).attr('src'),
          'data-title': $(this).attr('title') ?? '',
          'data-width': $(this).attr('width'),
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
          .map(element => [$(element).attr('href'), $(element).text()]),
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
      const html = $('<div />')
        .append($(element).clone(), $(scriptTags).clone())
        .html()
        .replace('<br />', '');
      $(element).replaceWith(
        `<iframe src="/api/iframe-service/?html=${encodeURIComponent(
          html,
        )}" height="500" title="Book your accommodation"></iframe>`,
      );
      $(scriptTags).remove();
    });

    // Fix captions
    $('p > a[href$=".jpg"]:first-child').each((_i, element) => {
      $(element.parent).addClass('text-sm text-center legacy-caption mb-8');
      $(element).addClass('post-image').insertBefore(element.parent);
    });

    html = $.html();
  }

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
    data,
    html,
    monthsOld,
    navCategory: data.contentNode?.navCategory?.nodes?.[0]?.slug ?? null,
    postNav,
    preview,
  };
}
