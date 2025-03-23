import '../../styles/wp-blocks.css';
import '../../custom-elements';
import { gql } from 'graphql-request';
import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Fragment } from 'react';
import getGQLClient from '../../lib/getGQLClient';
import fetchFirstValidId from '../../lib/fetchFirstValidId';
import { getPostPageProps } from '../../lib/getPostPageProps';
import Hero, { HeroContent } from '../../components/Hero';
import Layout, { LayoutMain, LayoutSidebar } from '../../components/Layout';
import PostArticle from '../../components/PostArticle';
import PostCard from '../../components/PostCard';
import CommentForm from '../../components/CommentForm';
import CommentThread from '../../components/CommentThread';
import SidebarDefault from '../../components/SidebarDefault';
import Footer from '../../components/Footer';
import PostQuery from '../../queries/Post.gql';
import PostMetadataQuery from '../../queries/PostMetadata.gql';
import SidebarQuery from '../../queries/Sidebar.gql';
import Header from '../../components/Header';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Post({ params }: Props) {
  const { slug } = await params;
  const databaseId = await fetchFirstValidId(slug, ['posts', 'pages']);

  if (!databaseId) {
    console.warn('databaseId not found for slug:', slug);
    return notFound();
  }

  const { isEnabled: preview } = await draftMode();

  const api = getGQLClient(preview ? 'preview' : 'admin');

  const [postData, blockData] = await Promise.all([
    api.request(PostQuery, {
      preview,
      id: databaseId,
      idType: 'DATABASE_ID',
    }),
    api.request(SidebarQuery),
  ]);

  if (
    postData.contentNode?.status === 'private' ||
    postData.contentNode?.patreonLevel > 0
  ) {
    return redirect(`/post/?p=${postData.contentNode.databaseId}`);
  }

  if (
    !postData.contentNode ||
    !['post', 'page'].includes(postData.contentNode.contentType?.node.name)
  ) {
    console.warn(
      'contentNode not found for database id, or not a post or page:',
      postData.contentNode,
    );
    return notFound();
  }

  const contentType = postData.contentNode.contentType?.node.name;
  const postProps = await getPostPageProps(postData, preview);

  return (
    <div className="relative bg-white dark:bg-gray-950 min-h-screen">
      <Header navCategory={postProps.navCategory} preview={preview} fullWidth />
      <div className="bg-gray-100 dark:bg-black">
        <Hero
          className="max-w-screen-2xl mx-auto"
          imgSm={
            postData.contentNode.thumbnails?.thumbnailHeaderSquare ??
            postData.contentNode.featuredImage?.node ??
            postData.defaultImages?.cover.small
          }
          imgLg={
            postData.contentNode.thumbnails?.thumbnailHeader ??
            postData.defaultImages?.cover.large
          }
          priority>
          <HeroContent>
            <div className="grid grid-rows-[0.5fr] pt-0">
              <div className="min-h-0">
                <div className="-translate-y-1/2">
                  <Layout>
                    <LayoutMain className="px-3 sm:px-4 md:px-8">
                      <div className="max-w-[52rem] mx-auto">
                        <div className="xl:w-[120%]">
                          <h1 className="text-3xl sm:text-4xl xl:text-5xl leading-tight xl:leading-tight font-display tracking-tight">
                            {postData.contentNode.title.replace(
                              /\s+(\S*)$/,
                              '\u00A0$1',
                            )}
                          </h1>
                        </div>
                      </div>
                    </LayoutMain>
                    <LayoutSidebar showBorder={false} />
                  </Layout>
                </div>
              </div>
            </div>
          </HeroContent>
        </Hero>
        <Layout className="relative max-w-screen-2xl bg-white dark:bg-gray-950 pb-14 xl:pb-0">
          <LayoutMain className="px-3 sm:px-4 md:px-8 text-lg">
            <div className="max-w-[52rem] mx-auto">
              <PostArticle
                className={
                  postData.contentNode.settings?.useNextStyles
                    ? 'post-next'
                    : 'post-legacy'
                }
                html={postProps.html}
              />
              {postData.contentNode.customRelatedPosts && (
                <div
                  className="pb-8 grid gap-4 xl:gap-6 md:grid-cols-2 lg:grid-cols-2"
                  id="related-posts">
                  {postData.contentNode.customRelatedPosts.nodes.map(post => (
                    <PostCard key={post.slug} inGrid post={post} />
                  ))}
                </div>
              )}
              {contentType === 'post' && (
                <div className="text-sm italic font-serif">
                  {postData.contentNode.categories.nodes.length > 0 && (
                    <>
                      Posted in{' '}
                      {postData.contentNode.categories.nodes.map(
                        (cat, index) => (
                          <Fragment key={cat.uri}>
                            {index > 0 && ', '}
                            <Link
                              href={cat.uri}
                              className="link"
                              dangerouslySetInnerHTML={{
                                __html: cat.name,
                              }}></Link>
                          </Fragment>
                        ),
                      )}
                      .
                    </>
                  )}
                  {postData.contentNode.tags.nodes.length > 0 && (
                    <>
                      {' '}
                      Tagged{' '}
                      {postData.contentNode.tags.nodes.map((tag, index) => (
                        <Fragment key={tag.uri}>
                          {index > 0 && ', '}
                          <Link
                            href={tag.uri}
                            className="link"
                            dangerouslySetInnerHTML={{
                              __html: tag.name,
                            }}></Link>
                        </Fragment>
                      ))}
                    </>
                  )}
                </div>
              )}
              {postProps.html &&
                postData.contentNode.commentStatus === 'open' && (
                  <>
                    <div className="page-heading mt-8 md:mt-12 mb-4">
                      Leave a Comment
                    </div>
                    <p className="mb-4 font-serif text-sm xl:text-base">
                      Questions, updates and trip reports are all welcome.
                      However, please keep comments polite and on-topic. See{' '}
                      <a className="link" href="/updates-accuracy#howtohelp2">
                        commenting etiquette
                      </a>{' '}
                      for details.
                    </p>
                    <div className="mb-12">
                      <CommentForm post={postData.contentNode.databaseId} />
                    </div>
                    <div id="comments">
                      {postData.contentNode.comments.nodes.length > 0 && (
                        <CommentThread
                          comments={postData.contentNode.comments.nodes}
                          post={postData.contentNode.databaseId}
                        />
                      )}
                    </div>
                  </>
                )}
            </div>
          </LayoutMain>
          <LayoutSidebar>
            <SidebarDefault blocks={blockData} />
            <Footer />
          </LayoutSidebar>
        </Layout>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }): Promise<Metadata> {
  const { slug } = await params;

  try {
    const databaseId = await fetchFirstValidId(slug, ['posts', 'pages']);

    if (!databaseId) return { title: 'Not Found' };

    const api = getGQLClient('admin');

    const data = await api.request(PostMetadataQuery, {
      preview: false,
      id: databaseId,
      idType: 'DATABASE_ID',
    });

    const {
      contentNode: {
        seo: {
          canonical,
          metaDesc: description,
          metaKeywords: keywords,
          metaRobotsNofollow,
          metaRobotsNoindex,
          opengraphAuthor,
          opengraphDescription,
          opengraphImage,
          opengraphModifiedTime,
          opengraphPublishedTime,
          opengraphSiteName,
          opengraphTitle,
          opengraphType,
          opengraphUrl,
          title,
          twitterDescription,
          twitterImage,
          twitterTitle,
        },
      },
    } = data;

    return {
      alternates: { canonical },
      authors: [
        { url: 'https://www.vietnamcoracle.com', name: 'Vietnam Coracle' },
      ],
      description,
      keywords,
      title,
      robots: {
        noindex: metaRobotsNoindex,
        nofollow: metaRobotsNofollow,
      },
      openGraph: {
        title: opengraphTitle,
        description: opengraphDescription,
        url: opengraphUrl,
        type: opengraphType,
        siteName: opengraphSiteName,
        publishedTime: opengraphPublishedTime,
        modifiedTime: opengraphModifiedTime,
        authors: [opengraphAuthor],
        images: [
          {
            url: opengraphImage.sourceUrl,
            alt: opengraphImage.altText,
            width: opengraphImage.mediaDetails.width,
            height: opengraphImage.mediaDetails.height,
            type: opengraphImage.mimeType,
          },
        ],
      },
      twitter: {
        title: twitterTitle,
        description: twitterDescription,
        images: [
          {
            url: twitterImage.sourceUrl,
            alt: twitterImage.altText,
            width: twitterImage.mediaDetails.width,
            height: twitterImage.mediaDetails.height,
            type: twitterImage.mimeType,
          },
        ],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error',
    };
  }
}

export async function generateStaticParams() {
  const query = gql`
    {
      contentNodes(first: 1000, where: { contentTypes: [PAGE, POST] }) {
        nodes {
          ... on ContentNode {
            uri
          }
        }
      }
    }
  `;
  const api = getGQLClient('admin');
  const data = await api.request(query);

  return data.contentNodes.nodes.map(node => ({
    slug: node.uri.split('/').filter(token => Boolean(token))[0],
  }));
}

// Set dynamic rendering strategy for app router
export const dynamic = 'force-static';

// Revalidate every hour
export const revalidate = 3600;
