import axios from 'axios';
import cheerio from 'cheerio';
import cx from 'classnames';
import { differenceInMonths, parse } from 'date-fns';
import { gql } from 'graphql-request';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useMemo, useRef } from 'react';
import useSWR from 'swr';
import CommentForm from '../components/CommentForm';
import CommentThread from '../components/CommentThread';
import Footer from '../components/Footer';
import Hero, { HeroContent } from '../components/Hero';
import Layout, { LayoutMain, LayoutSidebar } from '../components/Layout';
import NotFound from '../components/NotFound';
import OldPostAlert from '../components/OldPostAlert';
import PostCard from '../components/PostCard';
import SEO from '../components/SEO';
import ShareButtons from '../components/ShareButtons';
import SidebarDefault from '../components/SidebarDefault';
import GraphQLClient from '../lib/GraphQLClient';
import useWaitCursor from '../lib/useWaitCursor';

const POST_QUERY = gql`
  query Post($preview: Boolean!, $slug: ID!) {
    contentNode(id: $slug, idType: URI) {
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
        seo {
          ...SEOPostData
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
        seo {
          ...SEOPostData
        }
        settings {
          useNextStyles
        }
        thumbnails {
          thumbnailHeader {
            ...HeroImageData
          }
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
  ${SEO.fragments.post}
  ${SidebarDefault.fragments}
`;

function cleanPostHTML(html: string): string {
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

export default function Post({ data, html, fbShareCount, monthsOld, preview }) {
  const articleRef = useRef<HTMLDivElement>();
  const relatedPostsRef = useRef<HTMLDivElement>();
  const router = useRouter();

  const asyncRequest = useSWR(
    data?.contentNode.isRestricted && router.query?.secret
      ? [router.query.slug, router.query.secret]
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

  const content = useMemo(() => {
    return data || asyncRequest.data
      ? {
          ...data?.contentNode,
          ...asyncRequest.data?.contentNode,
          get showHero() {
            return this.featuredImage?.node && this.thumbnails?.thumbnailHeader;
          },
          type: data.contentNode.contentType?.node.name,
        }
      : null;
  }, [data, asyncRequest.data]);

  let articleHTML = html;

  if (asyncRequest.data) {
    articleHTML = cleanPostHTML(asyncRequest.data.contentNode.content);
  }

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

  const heading = (
    <h1
      className="text-3xl md:text-4xl xl:text-[2.75rem] text-white leading-tight xl:leading-tight font-display tracking-tight"
      id="top">
      {content.title}
    </h1>
  );

  return (
    <>
      <SEO {...content.seo}>
        <meta name="twitter:label1" content="Written by" />
        <meta name="twitter:data1" content="Vietnam Coracle" />
      </SEO>
      <Head>
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
      {content.showHero && (
        <Hero
          imgSm={content.featuredImage?.node}
          imgLg={content.thumbnails?.thumbnailHeader}>
          <HeroContent>
            <div className="max-w-screen-2xl mx-auto">
              <div className="xl:w-2/3 px-4 md:px-8">
                <div className="max-w-3xl mx-auto">{heading}</div>
              </div>
            </div>
          </HeroContent>
        </Hero>
      )}
      <Layout className="max-w-screen-2xl">
        <LayoutMain>
          <div className="px-4 md:px-8 text-lg">
            <div className="max-w-3xl mx-auto">
              {!content.showHero && heading}
              {content.type === 'post' && !content.isRestricted && (
                <ShareButtons
                  fbShareCount={fbShareCount}
                  image={content.featuredImage?.node.sourceUrl}
                  link={content.link}
                  title={content.title}
                />
              )}
              {content.type === 'post' && monthsOld > 36 && (
                <OldPostAlert monthsOld={monthsOld} />
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
        <LayoutSidebar className="border-l border-gray-200 dark:border-gray-800">
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
    fallback: true,
  };
}

export async function getStaticProps({ params: { slug }, preview = false }) {
  const data = await GraphQLClient.request(POST_QUERY, {
    preview,
    slug,
  });

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

  let html = '';

  if (data.contentNode?.content) {
    html = cleanPostHTML(data.contentNode.content);
  }

  let monthsOld: number = null;

  if (html) {
    const $ = cheerio.load(html);
    const lastUpdated = $(
      "p:first-of-type:contains('Last updated'), p:first-of-type:contains('First published')",
    );
    if (lastUpdated) {
      const date = lastUpdated
        .text()
        .match(/(Last\s+updated|First\s+published)\s+([^|]+)/i)?.[2]
        ?.trim();
      if (date) {
        const parsed = parse(date, 'LLLL yyyy', new Date());
        monthsOld = differenceInMonths(new Date(), parsed);
      }
    }
  }

  return {
    notFound: !data.contentNode,
    props: {
      data,
      html,
      monthsOld,
      preview,
      fbShareCount,
    },
    revalidate: 1,
  };
}