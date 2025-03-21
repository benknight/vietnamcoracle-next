'use client';
import { useEffect, useState } from 'react';
import Script from 'next/script';
import htmlToReact from 'html-react-parser';
import cmsToNextUrls from '../../lib/cmsToNextUrls';

interface PostHeadProps {
  databaseId: number;
  seoFullHead?: string;
  authorName?: string;
  globalStylesheet?: string;
}

export default function PostHead({
  databaseId,
  seoFullHead = '',
  authorName = 'Vietnam Coracle',
  globalStylesheet = '',
}: PostHeadProps) {
  const [headContent, setHeadContent] = useState(seoFullHead);
  const [stylesheet, setStylesheet] = useState(globalStylesheet);

  // Fetch SEO head content if not provided
  useEffect(() => {
    if (!seoFullHead) {
      fetch(`/api/posts/head?id=${databaseId}`)
        .then(res => res.json())
        .then(data => {
          if (data.head) {
            setHeadContent(data.head);
          }
        })
        .catch(err => console.error('Error fetching head content:', err));
    }

    // Fetch global stylesheet if not provided
    if (!globalStylesheet) {
      fetch(`/api/global-styles`)
        .then(res => res.json())
        .then(data => {
          if (data.stylesheet) {
            setStylesheet(data.stylesheet);
          }
        })
        .catch(err => console.error('Error fetching global styles:', err));
    }
  }, [databaseId, seoFullHead, globalStylesheet]);

  return (
    <>
      {/* Parse WordPress SEO head and convert to Next.js compatible format */}
      {/* {headContent && <>{htmlToReact(cmsToNextUrls(headContent))}</>} */}

      {/* Add additional metadata */}
      <meta name="twitter:label1" content="Written by" />
      <meta name="twitter:data1" content={authorName} />

      {/* Add global stylesheet */}
      {stylesheet && (
        <style
          dangerouslySetInnerHTML={{ __html: stylesheet }}
          href="#global-styles"
        />
      )}

      {/* Add necessary scripts */}
      <Script
        id="gutenberg-blocks"
        src="https://cms.vietnamcoracle.com/wp-content/plugins/stackable-ultimate-gutenberg-blocks/dist/frontend_blocks.js"
        strategy="afterInteractive"
      />
    </>
  );
}
