import axios from 'axios';
import cheerio from 'cheerio';
import cx from 'classnames';
import { differenceInMonths, parse } from 'date-fns';
import { gql } from 'graphql-request';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import {
  EmailShareButton,
  FacebookShareButton,
  PinterestShareButton,
  RedditShareButton,
  TwitterShareButton,
} from 'react-share';
import { ClockIcon } from '@heroicons/react/solid';
import EmailIcon from '@material-ui/icons/AlternateEmail';
import FacebookIcon from '@material-ui/icons/Facebook';
import PinterestIcon from '@material-ui/icons/Pinterest';
import RedditIcon from '@material-ui/icons/Reddit';
import TwitterIcon from '@material-ui/icons/Twitter';
import CommentForm from '../components/CommentForm';
import CommentThread from '../components/CommentThread';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import Layout, { LayoutMain, LayoutSidebar } from '../components/Layout';
import PostCard from '../components/PostCard';
import SidebarDefault from '../components/SidebarDefault';
import GraphQLClient from '../lib/GraphQLClient';
import useWaitCursor from '../lib/useWaitCursor';

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

const PostOrPage = ({ data, html, fbShareCount, monthsOld }) => {
  const articleRef = useRef<HTMLDivElement>();
  const relatedPostsRef = useRef<HTMLDivElement>();
  const router = useRouter();
  useWaitCursor(router.isFallback);

  useEffect(() => {
    const crpList = document.querySelector('.crp-list');
    if (!crpList) return;
    articleRef.current.insertBefore(
      relatedPostsRef.current,
      crpList.nextSibling,
    );
  }, []);

  if (router.isFallback) {
    return null;
  }

  if (!data) {
    return;
  }

  return (
    <>
      <Head>
        <meta name="description" content={data.contentNode.seo.metaDesc} />
        <meta
          name="robots"
          content={`${data.contentNode.seo.metaRobotsNoindex}, ${data.contentNode.seo.metaRobotsNofollow}`}
        />
        <meta
          property="article:published_time"
          content={data.contentNode.seo.opengraphPublishedTime}
        />
        <meta
          property="article:modified_time"
          content={data.contentNode.seo.opengraphModifiedTime}
        />
        <meta
          property="og:description"
          content={data.contentNode.seo.opengraphDescription}
        />
        {data.contentNode.seo.opengraphImage ? (
          <>
            <meta
              property="og:image"
              content={data.contentNode.seo.opengraphImage.sourceUrl}
            />
            <meta
              property="og:image:height"
              content={data.contentNode.seo.opengraphImage.mediaDetails.height}
            />
            <meta
              property="og:image:width"
              content={data.contentNode.seo.opengraphImage.mediaDetails.width}
            />
          </>
        ) : null}
        <meta property="og:locale" content="en_US" />
        <meta
          property="og:site_name"
          content={data.contentNode.seo.opengraphSiteName}
        />
        <meta property="og:type" content={data.contentNode.seo.opengraphType} />
        <meta property="og:url" content={data.contentNode.seo.opengraphUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={data.contentNode.seo.twitterTitle}
        />
        <meta
          name="twitter:description"
          content={data.contentNode.seo.twitterDescription}
        />
        <meta
          property="twitter:image"
          content={data.contentNode.seo.twitterImage?.sourceUrl}
        />
        <meta name="twitter:label1" content="Written by" />
        <meta name="twitter:data1" content="Tom" />
        <meta name="twitter:label2" content="Est. reading time" />
        <meta name="twitter:data2" content={data.contentNode.seo.readingTime} />
        <title>{data.contentNode.seo.title}</title>
        <link
          rel="canonical"
          href={data.contentNode.seo.canonical.replace('https', 'http')}
        />
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
        <script type="application/ld+json" className="yoast-schema-graph">
          {data.contentNode.seo.schema.raw}
        </script>
      </Head>
      <Hero
        imgSm={data.contentNode.featuredImage?.node}
        imgLg={data.contentNode.thumbnails?.thumbnailHeader}>
        <h1
          className="
            max-w-3xl xl:max-w-none mx-auto xl:mx-0 mt-8 mb-2 xl:px-8
            text-4xl xl:text-[2.75rem] leading-tight xl:leading-tight font-display tracking-tight"
          id="top">
          {data.contentNode.title}
        </h1>
      </Hero>
      <Layout>
        <LayoutMain>
          <div className="px-4 md:px-8 xl:pl-20 text-lg">
            <div className="max-w-3xl mx-auto xl:mx-0">
              <div className="flex flex-wrap text-white mt-8 dark:mt-0">
                <FacebookShareButton
                  className="rounded mr-2 mb-2"
                  style={{ backgroundColor: '#1877f2', fontSize: '12px' }}
                  title={data.contentNode.title}
                  url={data.contentNode.link}>
                  <span className="flex items-center px-2">
                    <FacebookIcon className="w-4 h-4" fontSize="small" />
                    <span className="mx-1 font-medium">Share</span>{' '}
                    {fbShareCount > 0 ? fbShareCount.toLocaleString() : ''}
                  </span>
                </FacebookShareButton>
                <TwitterShareButton
                  className="rounded mr-2 mb-2"
                  style={{ backgroundColor: '#1da1f2', fontSize: '12px' }}
                  title={data.contentNode.title}
                  url={data.contentNode.link}>
                  <span className="flex items-center px-2 font-medium">
                    <TwitterIcon className="w-4 h-4" fontSize="small" />
                    <span className="ml-1">Tweet</span>
                  </span>
                </TwitterShareButton>
                <PinterestShareButton
                  className="rounded mr-2 mb-2"
                  media={data.contentNode.featuredImage?.node.sourceUrl}
                  style={{ backgroundColor: '#e60023', fontSize: '12px' }}
                  title={data.contentNode.title}
                  url={data.contentNode.link}>
                  <span className="flex items-center px-2 font-medium">
                    <PinterestIcon className="w-4 h-4" />
                    <span className="ml-1">Pin</span>
                  </span>
                </PinterestShareButton>
                <RedditShareButton
                  className="rounded mr-2 mb-2"
                  style={{ backgroundColor: '#ff4500', fontSize: '12px' }}
                  title={data.contentNode.title}
                  url={data.contentNode.link}>
                  <span className="flex items-center px-2 font-medium">
                    <RedditIcon className="relative w-4 h-4 top-[-1px]" />
                    <span className="ml-1">Share</span>
                  </span>
                </RedditShareButton>
                <EmailShareButton
                  body=""
                  className="rounded mr-2 mb-2"
                  style={{ fontSize: '12px' }}
                  subject={data.contentNode.title}
                  url={data.contentNode.link}>
                  <span className="rounded bg-gray-500 flex items-center px-2 font-medium">
                    <EmailIcon className="w-4 h-4" fontSize="small" />
                    <span className="ml-1">Email</span>
                  </span>
                </EmailShareButton>
              </div>
              {monthsOld > 24 ? (
                <div className="flex items-center py-3 px-2 mt-8 mb-4 text-sm rounded bg-yellow-100 dark:bg-yellow-900  dark:bg-opacity-25 dark:border dark:border-yellow-500">
                  <ClockIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
                  <div className="flex-auto ml-2 leading-tight">
                    This article was last updated more than{' '}
                    {Math.floor(monthsOld / 12)} years ago.{' '}
                    <Link href="/updates-and-accuracy">
                      <a className="link">
                        Read more about accuracy &amp; updates
                      </a>
                    </Link>
                  </div>
                </div>
              ) : null}
              <article
                className="post"
                dangerouslySetInnerHTML={{
                  __html: html,
                }}
                ref={articleRef}
              />
              {data?.contentNode.customRelatedPosts ? (
                <div
                  className="pb-8 grid gap-4 xl:gap-6 md:grid-cols-2 lg:grid-cols-2"
                  ref={relatedPostsRef}>
                  {data.contentNode.customRelatedPosts.nodes.map(post => (
                    <PostCard key={post.slug} post={post} flex />
                  ))}
                </div>
              ) : null}
              <div className="page-heading mt-8 md:mt-12 mb-4">
                Leave a Comment
              </div>
              <div className="mb-12">
                <CommentForm post={data.contentNode.databaseId} />
              </div>
              {data.contentNode.comments.nodes.length > 0 ? (
                <>
                  <div className="page-heading mb-4">
                    {data.contentNode.commentCount} Comments
                  </div>
                  <CommentThread comments={data.contentNode.comments.nodes} />
                </>
              ) : null}
            </div>
          </div>
        </LayoutMain>
        <LayoutSidebar>
          <SidebarDefault data={data} />
          <Footer data={data} />
        </LayoutSidebar>
      </Layout>
    </>
  );
};

export function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export async function getStaticProps({ params: { node }, preview = false }) {
  const query = gql`
    query PageOrPost($preview: Boolean!, $slug: ID!) {
      contentNode(id: $slug, idType: URI) {
        ... on ContentNode {
          databaseId
          link
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
            ...SEOData
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
            ...SEOData
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
    fragment SEOData on PostTypeSEO {
      canonical
      metaDesc
      metaRobotsNofollow
      metaRobotsNoindex
      opengraphDescription
      opengraphImage {
        mediaDetails {
          height
          width
        }
        sourceUrl
      }
      opengraphModifiedTime
      opengraphPublishedTime
      opengraphSiteName
      opengraphTitle
      opengraphType
      opengraphUrl
      readingTime
      schema {
        raw
      }
      title
      twitterDescription
      twitterImage {
        mediaDetails {
          height
          width
        }
        sourceUrl
      }
      twitterTitle
    }
    ${CommentThread.fragments}
    ${Hero.fragments}
    ${Footer.fragments}
    ${PostCard.fragments}
    ${SidebarDefault.fragments}
  `;

  const data = await GraphQLClient.request(query, {
    preview,
    slug: node,
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

export default PostOrPage;
