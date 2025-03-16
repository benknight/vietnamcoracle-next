import cx from 'classnames';
import htmlToReact from 'html-react-parser';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo, useRef, Fragment } from 'react';
import Headroom from 'react-headroom';
import { Menu } from '@headlessui/react';
import { MenuAlt1Icon } from '@heroicons/react/outline';
import useMediaQuery from '@mui/material/useMediaQuery';
import breakpoints from '../config/breakpoints';
import cmsToNextUrls from '../lib/cmsToNextUrls';
import useWaitCursor from '../lib/useWaitCursor';
import CommentForm from './CommentForm';
import CommentThread from './CommentThread';
import Footer from './Footer';
import Hero, { HeroContent } from './Hero';
import Layout, { LayoutMain, LayoutSidebar } from './Layout';
import PostCard from './PostCard';
import SidebarDefault from './SidebarDefault';

export default function Post({ data, html, postNav }) {
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
        {htmlToReact(cmsToNextUrls(content.seo.fullHead))}
        <meta name="twitter:label1" content="Written by" />
        <meta name="twitter:data1" content="Vietnam Coracle" />
        <link
          href="https://cms.vietnamcoracle.com/wp-content/plugins/stackable-ultimate-gutenberg-blocks/dist/frontend_blocks.css"
          rel="stylesheet"
        />
        <link
          href="https://cms.vietnamcoracle.com/wp-includes/css/dist/block-library/style.css?v=1"
          rel="stylesheet"
        />
        <script
          async
          src="https://cms.vietnamcoracle.com/wp-content/plugins/stackable-ultimate-gutenberg-blocks/dist/frontend_blocks.js"
        />
        <style dangerouslySetInnerHTML={{ __html: data.globalStylesheet }} />
      </Head>
      <div className="bg-gray-100 dark:bg-black">
        <Hero
          className="max-w-screen-2xl mx-auto"
          imgSm={
            content.thumbnails?.thumbnailHeaderSquare ??
            content.featuredImage?.node ??
            data.defaultImages?.cover.small
          }
          imgLg={
            content.thumbnails?.thumbnailHeader ??
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
                            {content.title.replace(/\s+(\S*)$/, '\u00A0$1')}
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

        {postNav?.length > 0 && (
          <Headroom
            className={cx(
              'z-10 absolute lg:fixed top-[-9999px] lg:top-auto lg:bottom-0 lg:left-0 w-full lg:w-auto',
            )}
            disable={isLG}
            downTolerance={10}
            pinStart={1000}>
            <div className="h-14" />
            <div className="absolute top-14 lg:top-auto lg:left-0 lg:bottom-0 w-full lg:w-auto">
              <Menu
                as="nav"
                className="text-sm lg:text-base tracking-widest ring-1 ring-gray-300 dark:ring-gray-800 shadow-xl lg:rounded-tr-xl overflow-hidden">
                <Menu.Button className="flex items-center justify-center lg:justify-start w-full p-3 lg:px-8 lg:h-10 lg:text-sm font-medium bg-gradient-to-b from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
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
                            'block -mx-4 -my-2 px-4 py-2 rounded whitespace-nowrap uppercase',
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
        <Layout className="relative max-w-screen-2xl bg-white dark:bg-gray-950 pb-14 xl:pb-0">
          <LayoutMain className="px-3 sm:px-4 md:px-8 text-lg">
            <div className="max-w-[52rem] mx-auto">
              <article
                className={cx(
                  'post break-words py-px',
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
                    <PostCard key={post.slug} inGrid post={post} />
                  ))}
                </div>
              )}
              {content.type === 'post' && (
                <div className="text-sm italic font-serif">
                  {content.categories.nodes.length > 0 && (
                    <>
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
                      .
                    </>
                  )}
                  {content.tags.nodes.length > 0 && (
                    <>
                      {' '}
                      Tagged{' '}
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
                    </>
                  )}
                </div>
              )}
              {html && data?.contentNode.commentStatus === 'open' && (
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
                    <CommentForm post={content.databaseId} />
                  </div>
                  <div id="comments">
                    {content.comments.nodes.length > 0 && (
                      <CommentThread
                        comments={content.comments.nodes}
                        post={content.databaseId}
                      />
                    )}
                  </div>
                </>
              )}
            </div>
          </LayoutMain>
          <LayoutSidebar>
            <SidebarDefault />
            <Footer />
          </LayoutSidebar>
        </Layout>
      </div>
    </>
  );
}
