import '../styles/wp-blocks.css';
import '../custom-elements';
import Link from 'next/link';
import { Fragment } from 'react';
import preparePostData from '../lib/preparePostData';
import Hero, { HeroContent } from './Hero';
import Layout, { LayoutMain, LayoutSidebar } from './Layout';
import PostArticle from './PostArticle';
import PostCard from './PostCard';
import CommentForm from './CommentForm';
import CommentThread from './CommentThread';
import SidebarDefault from './SidebarDefault';
import Footer from './Footer';
import Header from './Header';

interface Props {
  post: Awaited<ReturnType<typeof preparePostData>>;
  preview: boolean;
  sidebarBlocks: React.ComponentProps<typeof SidebarDefault>['blocks'];
}

export default function Post(props: Props) {
  const { post, preview, sidebarBlocks } = props;

  return (
    <div className="force-light-theme text-gray-800">
      {post.ads?.header?.enabled && (
        <div className="bg-gray-300 dark:bg-gray-800 overflow-hidden aspect-[2]">
          <div
            className="w-full h-full"
            dangerouslySetInnerHTML={{
              __html: post.ads.header.html,
            }}
          />
        </div>
      )}
      <div className="relative bg-white dark:bg-gray-950 min-h-screen">
        <Header navCategory={post.navCategory} preview={preview} fullWidth />
        <div className="bg-gray-100 dark:bg-black">
          <Hero
            className="max-w-screen-2xl mx-auto"
            imgSm={post.heroImage.small}
            imgLg={post.heroImage.large}
            priority>
            <HeroContent>
              <div className="grid grid-rows-[0.5fr] pt-0">
                <div className="min-h-0">
                  <div className="-translate-y-1/2">
                    <Layout>
                      <LayoutMain className="px-3 sm:px-4 md:px-8">
                        <div className="max-w-[52rem] mx-auto">
                          <div className="xl:w-[120%]">
                            <h1 className="text-3xl sm:text-4xl leading-tight xl:leading-tight font-display tracking-tight">
                              {post.title}
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
                    post.contentNode.settings?.useNextStyles
                      ? 'post-next'
                      : 'post-legacy'
                  }
                  html={post.html}
                />
                {post.contentNode.customRelatedPosts && (
                  <div
                    className="pb-8 grid gap-4 xl:gap-6 md:grid-cols-2 lg:grid-cols-2"
                    id="related-posts">
                    {post.contentNode.customRelatedPosts.nodes.map(post => (
                      <PostCard
                        key={post.slug}
                        inGrid
                        navCategory={post.navCategory}
                        post={post}
                      />
                    ))}
                  </div>
                )}
                {post.contentType === 'post' && (
                  <div className="text-sm italic font-serif">
                    {post.contentNode.categories.nodes.length > 0 && (
                      <>
                        Posted in{' '}
                        {post.contentNode.categories.nodes.map((cat, index) => (
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
                    {post.contentNode.tags.nodes.length > 0 && (
                      <>
                        {' '}
                        Tagged{' '}
                        {post.contentNode.tags.nodes.map((tag, index) => (
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
                {post.html && post.contentNode.commentStatus === 'open' && (
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
                      <CommentForm post={post.contentNode.databaseId} />
                    </div>
                    <div id="comments">
                      {post.contentNode.comments.nodes.length > 0 && (
                        <CommentThread
                          comments={post.contentNode.comments.nodes}
                          post={post.contentNode.databaseId}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            </LayoutMain>
            <LayoutSidebar>
              <SidebarDefault blocks={sidebarBlocks} />
              <Footer />
            </LayoutSidebar>
          </Layout>
        </div>
      </div>
    </div>
  );
}
