import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { gql } from 'graphql-request';
import { Fragment } from 'react';
import { POST_QUERY } from '../../config/queries';
import getGQLClient from '../../lib/getGQLClient';
import { getPostPageProps } from '../../lib/getPostPageProps';
import { RestClientAdmin } from '../../lib/RestClient';
// import PostContent from './PostContent';
import Hero, { HeroContent } from '../../components/Hero';
import Layout, { LayoutMain, LayoutSidebar } from '../../components/Layout';
import PostArticle from '../../components/PostArticle';
import PostCard from '../../components/PostCard';
import CommentForm from '../../components/CommentForm';
import CommentThread from '../../components/CommentThread';
import SidebarDefault from '../../components/SidebarDefault';
import Footer from '../../components/Footer';

async function fetchFirstValidId(
  slug: string,
  endpoints: string[],
): Promise<number | null> {
  for (let endpoint of endpoints) {
    const url = `/${endpoint}?slug=${encodeURIComponent(
      slug,
    )}&_fields=id&status=private,publish`;

    const response = await RestClientAdmin.get(url);

    if (response.data?.[0]?.id) {
      return response.data[0].id;
    }
  }
  return null;
}

async function fetchBlockData() {
  const api = getGQLClient('admin');

  const result = await api.request(gql`
    query Sidebar {
      about: block(id: "cG9zdDozNjExOA==") {
        ...Block
      }
      subscribe: block(id: "cG9zdDozNzcwNQ==") {
        ...Block
      }
      support: block(id: "cG9zdDozNzY4Nw==") {
        ...Block
      }
    }
    fragment Block on Block {
      block {
        description
        title
        image {
          sourceUrl
        }
        link {
          title
          url
        }
        messages {
          key
          value
        }
      }
    }
  `);

  return result;
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

export default async function Post({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { isEnabled: preview } = await draftMode();

  const databaseId = await fetchFirstValidId(slug, ['posts', 'pages']);

  if (!databaseId) {
    console.warn('databaseId not found for slug:', slug);
    return notFound();
  }

  const api = getGQLClient(preview ? 'preview' : 'admin');

  const data = await api.request(POST_QUERY, {
    preview,
    id: databaseId,
    idType: 'DATABASE_ID',
  });

  if (
    data.contentNode?.status === 'private' ||
    data.contentNode?.patreonLevel > 0
  ) {
    return redirect(`/post/?p=${data.contentNode.databaseId}`);
  }

  if (
    !data.contentNode ||
    !['post', 'page'].includes(data.contentNode.contentType?.node.name)
  ) {
    console.warn(
      'contentNode not found for database id, or not a post or page:',
      data.contentNode,
    );
    return notFound();
  }

  const blockData = await fetchBlockData();
  const contentType = data.contentNode.contentType?.node.name;
  const postProps = await getPostPageProps(data, preview);

  return (
    <div className="bg-gray-100 dark:bg-black">
      <Hero
        className="max-w-screen-2xl mx-auto"
        imgSm={
          data.contentNode.thumbnails?.thumbnailHeaderSquare ??
          data.contentNode.featuredImage?.node ??
          data.defaultImages?.cover.small
        }
        imgLg={
          data.contentNode.thumbnails?.thumbnailHeader ??
          data.defaultImages?.cover.large
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
                          {data.contentNode.title.replace(
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
                data.contentNode.settings?.useNextStyles
                  ? 'post-next'
                  : 'post-legacy'
              }
              html={postProps.html}
            />
            {data?.contentNode.customRelatedPosts && (
              <div
                className="pb-8 grid gap-4 xl:gap-6 md:grid-cols-2 lg:grid-cols-2"
                id="related-posts">
                {data.contentNode.customRelatedPosts.nodes.map(post => (
                  <PostCard key={post.slug} inGrid post={post} />
                ))}
              </div>
            )}
            {contentType === 'post' && (
              <div className="text-sm italic font-serif">
                {data.contentNode.categories.nodes.length > 0 && (
                  <>
                    Posted in{' '}
                    {data.contentNode.categories.nodes.map((cat, index) => (
                      <Fragment key={cat.uri}>
                        {index > 0 && ', '}
                        <Link
                          href={cat.uri}
                          className="link"
                          dangerouslySetInnerHTML={{
                            __html: cat.name,
                          }}></Link>
                      </Fragment>
                    ))}
                    .
                  </>
                )}
                {data.contentNode.tags.nodes.length > 0 && (
                  <>
                    {' '}
                    Tagged{' '}
                    {data.contentNode.tags.nodes.map((tag, index) => (
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
            {postProps.html && data.contentNode.commentStatus === 'open' && (
              <>
                <div className="page-heading mt-8 md:mt-12 mb-4">
                  Leave a Comment
                </div>
                <p className="mb-4 font-serif text-sm xl:text-base">
                  Questions, updates and trip reports are all welcome. However,
                  please keep comments polite and on-topic. See{' '}
                  <a className="link" href="/updates-accuracy#howtohelp2">
                    commenting etiquette
                  </a>{' '}
                  for details.
                </p>
                <div className="mb-12">
                  <CommentForm post={data.contentNode.databaseId} />
                </div>
                <div id="comments">
                  {data.contentNode.comments.nodes.length > 0 && (
                    <CommentThread
                      comments={data.contentNode.comments.nodes}
                      post={data.contentNode.databaseId}
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
  );
}

// Add metadata export for SEO
export async function generateMetadata({ params }): Promise<Metadata> {
  const { slug } = await params;

  try {
    const databaseId = await fetchFirstValidId(slug, ['posts', 'pages']);
    if (!databaseId) return { title: 'Not Found' };

    const api = getGQLClient('admin');

    const data = await api.request(POST_QUERY, {
      preview: false,
      id: databaseId,
      idType: 'DATABASE_ID',
    });

    // Return structured metadata that Next.js can use
    // You'll need to parse the SEO data from your CMS
    return {
      title: data.contentNode?.title || 'Post',
      // Add other metadata as needed
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error',
    };
  }
}

// Set dynamic rendering strategy for app router
export const dynamic = 'force-static';

export const revalidate = 3600; // Revalidate every hour
