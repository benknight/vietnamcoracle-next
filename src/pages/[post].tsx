import axios from 'axios';
import cheerio from 'cheerio';
import cx from 'classnames';
import { differenceInMonths, parse } from 'date-fns';
import { gql } from 'graphql-request';
import htmlToReact from 'html-react-parser';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef } from 'react';
import useSWR from 'swr';
import { Popover, Transition } from '@headlessui/react';
import { MenuAlt1Icon } from '@heroicons/react/outline';
import CommentForm from '../components/CommentForm';
import CommentThread from '../components/CommentThread';
import Footer from '../components/Footer';
import Hero, { HeroContent } from '../components/Hero';
import Layout, { LayoutMain, LayoutSidebar } from '../components/Layout';
import NotFound from '../components/NotFound';
import OldPostAlert from '../components/OldPostAlert';
import PostCard from '../components/PostCard';
import SidebarDefault from '../components/SidebarDefault';
import GraphQLClient from '../lib/GraphQLClient';
import cleanPostHTML from '../lib/cleanPostHTML';
import internalizeUrl from '../lib/internalizeUrl';
import useWaitCursor from '../lib/useWaitCursor';

type NavLinks = string[][];
interface Props {
  data: any;
  html: string;
  monthsOld?: number;
  postNav?: NavLinks;
  preview: boolean;
}

export default function Post({
  data,
  html,
  monthsOld,
  postNav,
  preview,
}: Props) {
  const articleRef = useRef<HTMLDivElement>();
  const relatedPostsRef = useRef<HTMLDivElement>();
  const router = useRouter();

  // Client-side query when content is restricted
  const asyncRequest = useSWR(
    data?.contentNode.isRestricted && router.query?.secret
      ? [router.query.post, router.query.secret]
      : null,
    (slug, secret) => {
      return GraphQLClient.request(
        POST_QUERY,
        { preview, slug },
        { 'X-Coracle-Post-Password': secret },
      );
    },
    {
      revalidateOnFocus: false,
    },
  );

  // Combine server data with client data
  const content = useMemo(() => {
    return data || asyncRequest.data
      ? {
          ...data?.contentNode,
          ...asyncRequest.data?.contentNode,
          type: data.contentNode.contentType?.node.name,
        }
      : null;
  }, [data, asyncRequest.data]);

  // Internalize in-article links for client-side transitions
  useEffect(() => {
    articleRef.current.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', event => {
        const internal = internalizeUrl(link.href);
        if (internal !== link.href) {
          event.preventDefault();
          router.push(internal);
        }
      });
    });
  }, [router.asPath]);

  useWaitCursor(router.isFallback || asyncRequest.isValidating);

  if (router.isFallback) {
    return null;
  }

  if (!content) {
    return;
  }

  if (typeof window !== 'undefined' && content.isRestricted) {
    if (router.query?.secret) {
      return <div className="text-center py-12">Loading…</div>;
    }
    return <NotFound />;
  }

  const articleHTML = asyncRequest.data?.contentNode?.content
    ? cleanPostHTML(asyncRequest.data.contentNode.content)
    : html;

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
      <Layout className="relative max-w-screen-2xl">
        <LayoutMain>
          <div className="px-3 sm:px-4 md:px-8 text-lg">
            <div className="max-w-3xl mx-auto">
              {content.type === 'post' && monthsOld > 36 && (
                <OldPostAlert className="mb-6 lg:mb-8" monthsOld={monthsOld} />
              )}
              {postNav?.length > 0 && (
                <Popover className="fixed z-10 bottom-16 right-2 xl:right-auto xl:left-2 lg:bottom-2 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 rounded-lg ring-1 ring-gray-400 shadow-md">
                  <Popover.Button className="flex items-center w-full py-2 px-4 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                    <MenuAlt1Icon className="w-5 h-5" />
                    <span className="mx-2">Contents</span>
                  </Popover.Button>
                  <Popover.Panel>
                    <nav>
                      <ul className="pt-1 pr-12 pb-4 pl-4">
                        {postNav.map(link => (
                          <li>
                            <a className="link" href={link[0]}>
                              {link[1]}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </Popover.Panel>
                </Popover>
              )}
              <article
                className={cx(
                  'post',
                  content.settings?.useNextStyles ? 'post-next' : 'post-legacy',
                )}
                dangerouslySetInnerHTML={{
                  __html: articleHTML,
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
              {articleHTML && (
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

export function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps({
  params: { post: slug },
  preview = false,
}): Promise<{
  notFound: boolean;
  props: Props;
  revalidate: 1;
}> {
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
      "p:first-of-type:contains('Last updated'), p:first-of-type:contains('First published')",
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
