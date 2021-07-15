import axios from 'axios';
import cheerio from 'cheerio';
import cx from 'classnames';
import { differenceInMonths, parse } from 'date-fns';
import { gql } from 'graphql-request';
import htmlToReact from 'html-react-parser';
import type { InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, Fragment } from 'react';
import Headroom from 'react-headroom';
import { Menu } from '@headlessui/react';
import { MenuAlt1Icon } from '@heroicons/react/outline';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CommentForm from '../components/CommentForm';
import CommentThread from '../components/CommentThread';
import Footer from '../components/Footer';
import Hero, { HeroContent } from '../components/Hero';
import Layout, { LayoutMain, LayoutSidebar } from '../components/Layout';
import OldPostAlert from '../components/OldPostAlert';
import PostCard from '../components/PostCard';
import SidebarDefault from '../components/SidebarDefault';
import breakpoints from '../config/breakpoints';
import GraphQLClient from '../lib/GraphQLClient';
import cleanPostHTML from '../lib/cleanPostHTML';
import internalizeUrl from '../lib/internalizeUrl';
import useWaitCursor from '../lib/useWaitCursor';

type NavLinks = string[][];

export default function Post({
  data,
  html,
  monthsOld,
  postNav,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const articleRef = useRef<HTMLDivElement>();
  const relatedPostsRef = useRef<HTMLDivElement>();
  const router = useRouter();
  const isLG = useMediaQuery(`(min-width: ${breakpoints.lg})`);

  // Combine server data with client data
  const content = useMemo(() => {
    return data
      ? {
          ...data?.contentNode,
          type: data.contentNode.contentType?.node.name,
        }
      : null;
  }, [data]);

  // Internalize in-article links for client-side transitions
  useEffect(() => {
    articleRef.current.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', event => {
        const internal = internalizeUrl(link.href);
        if (internal !== link.href) {
          event.preventDefault();
          const url = new URL(link.href);
          const params = new URLSearchParams(url.search);
          if (params.has('p')) {
            router.push(`/post?p=${params.get('p')}`);
          } else {
            router.push(internal);
          }
        }
      });
    });
  }, [router.asPath]);

  useWaitCursor(router.isFallback);

  if (router.isFallback) {
    return null;
  }

  if (!content) {
    return;
  }

  return (
    <>
      <Head>
        {htmlToReact(content.seo.fullHead)}
        <meta name="twitter:label1" content="Written by" />
        <meta name="twitter:data1" content="Vietnam Coracle" />
        <link
          href="https://vietnamcoracle.com/wp-content/plugins/stackable-ultimate-gutenberg-blocks/dist/frontend_blocks.css"
          rel="stylesheet"
        />
        <link
          href="https://vietnamcoracle.com/wp-includes/css/dist/block-library/style.css"
          rel="stylesheet"
        />
        <script
          async
          src="https://vietnamcoracle.com/wp-content/plugins/stackable-ultimate-gutenberg-blocks/dist/frontend_blocks.js"
        />
      </Head>
      <Hero
        className="relative"
        imgSm={
          content.thumbnails?.thumbnailHeaderSquare ??
          content.featuredImage?.node ??
          data.defaultImages?.cover.small
        }
        imgLg={
          content.thumbnails?.thumbnailHeader ?? data.defaultImages?.cover.large
        }>
        <HeroContent>
          <div className="max-w-screen-2xl mx-auto">
            <div className="xl:w-2/3 px-3 sm:px-4 md:px-8">
              <div className="max-w-3xl mx-auto">
                <div className="xl:w-[150%]">
                  <h1 className="text-3xl sm:text-4xl xl:text-[2.75rem] leading-tight xl:leading-tight font-display tracking-tight">
                    {content.title}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </HeroContent>
      </Hero>
      {postNav?.length > 0 && (
        <Headroom
          className={cx(
            'z-10 absolute lg:fixed top-[-9999px] lg:top-auto lg:bottom-0 lg:left-0 w-full lg:w-auto',
          )}
          disable={isLG}
          pinStart={1000}>
          <div className="h-14" />
          <div className="absolute top-14 lg:top-auto lg:left-0 lg:bottom-0 w-full lg:w-auto">
            <Menu
              as="nav"
              className="text-sm lg:text-base tracking-widest ring-1 ring-gray-300 dark:ring-gray-800 shadow-xl lg:rounded-tr-xl overflow-hidden">
              <Menu.Button className="flex items-center justify-center lg:justify-start w-full p-3 lg:px-8 font-medium bg-gradient-to-b from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                <MenuAlt1Icon className="w-4 h-4" />
                <span className="pl-2 pr-2">Contents</span>
              </Menu.Button>
              <Menu.Items
                as="ul"
                className="px-8 py-4 lg:pr-12 font-display text-center lg:text-left bg-gray-200 dark:bg-gray-700">
                {postNav.map(link => (
                  <Menu.Item as="li" className="my-3" key={link[0]}>
                    {({ active }) => (
                      <a
                        className={cx(
                          'block -mx-4 -my-2 px-4 py-2 rounded whitespace-nowrap',
                          {
                            'bg-gray-300 dark:bg-gray-600': active,
                          },
                        )}
                        href={link[0]}>
                        {link[1]}
                      </a>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Menu>
          </div>
        </Headroom>
      )}
      <Layout className="relative max-w-screen-2xl">
        <LayoutMain>
          <div className="px-3 sm:px-4 md:px-8 text-lg">
            <div className="max-w-3xl mx-auto">
              {content.type === 'post' && monthsOld > 36 && (
                <OldPostAlert className="mb-6 lg:mb-8" monthsOld={monthsOld} />
              )}
              <article
                className={cx(
                  'post',
                  content.settings?.useNextStyles ? 'post-next' : 'post-legacy',
                )}
                dangerouslySetInnerHTML={{
                  __html: html,
                }}
                ref={articleRef}
              />
              {data?.contentNode.customRelatedPosts && (
                <div
                  className="pb-8 grid gap-4 xl:gap-6 md:grid-cols-2 lg:grid-cols-2"
                  id="related-posts"
                  ref={relatedPostsRef}>
                  {content.customRelatedPosts.nodes.map(post => (
                    <PostCard key={post.slug} post={post} inGrid />
                  ))}
                </div>
              )}
              {content.type === 'post' && (
                <div className="text-sm italic">
                  Posted in{' '}
                  {content.categories.nodes.map((cat, index) => (
                    <Fragment key={cat.uri}>
                      {index > 0 && ', '}
                      <Link href={cat.uri}>
                        <a
                          className="link"
                          dangerouslySetInnerHTML={{ __html: cat.name }}
                        />
                      </Link>
                    </Fragment>
                  ))}
                  . Tagged{' '}
                  {content.tags.nodes.map((tag, index) => (
                    <Fragment key={tag.uri}>
                      {index > 0 && ', '}
                      <Link href={tag.uri}>
                        <a
                          className="link"
                          dangerouslySetInnerHTML={{ __html: tag.name }}
                        />
                      </Link>
                    </Fragment>
                  ))}
                </div>
              )}
              {html && (
                <>
                  <div className="page-heading mt-8 md:mt-12 mb-4">
                    Leave a Comment
                  </div>
                  <div className="mb-12">
                    <CommentForm post={content.databaseId} />
                  </div>
                  {content.comments.nodes.length > 0 && (
                    <>
                      <div className="page-heading mb-4" id="comments">
                        {content.commentCount} Comments
                      </div>
                      <CommentThread comments={content.comments.nodes} />
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </LayoutMain>
        <LayoutSidebar className="relative xl:border-l border-gray-200 dark:border-gray-800">
          <div className="hidden xl:block absolute top-0 -left-px w-px h-48 bg-gradient-to-b from-white dark:from-gray-950 to-transparent" />
          <SidebarDefault data={data} />
          <Footer data={data} />
        </LayoutSidebar>
      </Layout>
    </>
  );
}

export async function getStaticPaths() {
  const query = gql`
    {
      contentNodes(first: 1000) {
        nodes {
          ... on ContentNode {
            uri
          }
        }
      }
    }
  `;
  const data = await GraphQLClient.request(query);
  const result = {
    paths: [
      ...data.contentNodes.nodes.map(node => ({
        params: {
          slug: node.uri.split('/').filter(token => Boolean(token))[0],
        },
      })),
    ],
    fallback: 'blocking',
  };
  return result;
}

export async function getStaticProps({ params: { slug }, preview = false }) {
  const data = await GraphQLClient.request(POST_QUERY, {
    preview,
    id: slug,
  });

  if (preview && data.contentNode) {
    data.contentNode = {
      ...data.contentNode,
      ...data.contentNode.preview?.node,
    };
  }

  let fbShareCount = 0;

  if (data.contentNode) {
    try {
      const response = await axios.get(
        `https://graph.facebook.com/v10.0/?access_token=${
          process.env.FACEBOOK_ACCESS_TOKEN
        }&id=${encodeURIComponent(
          data.contentNode.link,
        )}&fields=og_object{engagement}`,
      );
      fbShareCount = response.data?.og_object?.engagement?.count ?? 0;
    } catch (error) {
      // console.error(error);
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

    if (lastUpdated) {
      lastUpdated.addClass('!font-display text-sm');
      const date = lastUpdated
        .text()
        .match(/(Last\s+updated|First\s+published)\s+([^|]+)/i)?.[2]
        ?.trim();
      if (date) {
        const parsed = parse(date, 'LLLL yyyy', new Date());
        monthsOld = differenceInMonths(new Date(), parsed);
      }
    }

    if (!data.contentNode.isRestricted) {
      if (lastUpdated) {
        $('<share-buttons />').insertAfter(lastUpdated);
      } else {
        $.root().prepend('<share-buttons />');
      }
    }

    // Pass post data to share buttons
    $('share-buttons').attr({
      'data-share-count': String(fbShareCount),
      'data-title': data.contentNode.title,
      'data-link': data.contentNode.link,
      'data-image': data.contentNode.featuredImage?.node.sourceUrl ?? '',
    });

    // Generate contents menu
    const internalLinks = $('h2 strong a');
    if (internalLinks) {
      postNav = [
        ...internalLinks
          .toArray()
          .map(element => [$(element).attr('href'), $(element).text()]),
      ];
    }

    // Remove "Back Top" link after related posts
    const relatedPosts = $('related-posts');
    if (relatedPosts) {
      relatedPosts.parent().next('p:has(a[href="#top"])').remove();
    }

    $('div[id^="adgshp"]').each((_i, element) => {
      const scriptTags = [
        ...$(element).nextAll('script').toArray(),
        ...$(element).next('p').find('script').toArray(),
      ];
      const html = $('div')
        .append($(element).clone(), $(scriptTags).clone())
        .html();
      $(element).replaceWith(
        `<iframe src="/api/iframe-service?html=${encodeURIComponent(
          html,
        )}" height="420" title="Book your accommodation"></iframe>`,
      );
      $(scriptTags).remove();
    });

    // Fix captions
    $('p > a[href$=".jpg"]:first-child').each((_i, element) => {
      $(element).addClass('block mb-2');
      $(element)
        .nextAll()
        .wrapAll(
          '<span class="block text-sm text-center legacy-caption"></span>',
        );
    });

    html = $.html();
  }

  return {
    notFound: !data.contentNode,
    props: {
      data,
      html,
      monthsOld,
      postNav,
      preview,
    },
    revalidate: 1,
  };
}

const POST_QUERY = gql`
  query Post($preview: Boolean!, $id: ID!) {
    contentNode(id: $id, idType: URI) {
      ... on ContentNode {
        databaseId
        isRestricted
        link
        contentType {
          node {
            name
          }
        }
      }
      ... on NodeWithComments {
        commentCount
      }
      ... on NodeWithContentEditor {
        content
      }
      ... on NodeWithFeaturedImage {
        featuredImage {
          node {
            ...HeroImageData
          }
        }
      }
      ... on NodeWithTitle {
        title
      }
      ... on Page {
        comments(first: 1000) {
          nodes {
            ...CommentThreadCommentData
          }
        }
        preview @include(if: $preview) {
          node {
            content
            title
          }
        }
        seo {
          fullHead
        }
        thumbnails {
          thumbnailHeader {
            ...HeroImageData
          }
          thumbnailHeaderSquare {
            ...HeroImageData
          }
        }
      }
      ... on Post {
        categories(
          where: {
            exclude: "154" # Exclude top-level category
          }
        ) {
          nodes {
            name
            uri
          }
        }
        comments(first: 1000) {
          nodes {
            ...CommentThreadCommentData
          }
        }
        customRelatedPosts(first: 6) {
          nodes {
            ...PostCardPostData
          }
        }
        preview @include(if: $preview) {
          node {
            content
            title
          }
        }
        seo {
          fullHead
        }
        settings {
          useNextStyles
        }
        tags {
          nodes {
            name
            uri
          }
        }
        thumbnails {
          thumbnailHeader {
            ...HeroImageData
          }
          thumbnailHeaderSquare {
            ...HeroImageData
          }
        }
      }
    }
    defaultImages {
      cover {
        large {
          ...HeroImageData
        }
        small {
          ...HeroImageData
        }
      }
    }
    ...FooterData
    ...SidebarDefaultData
  }
  ${CommentThread.fragments}
  ${Hero.fragments}
  ${Footer.fragments}
  ${PostCard.fragments}
  ${SidebarDefault.fragments}
`;
