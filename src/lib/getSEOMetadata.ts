import cmsToNextUrls from './cmsToNextUrls';

export default function getSEOMetadata(data: any) {
  const {
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
  } = data;
  return {
    alternates: { canonical: cmsToNextUrls(canonical) },
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
      url: cmsToNextUrls(opengraphUrl),
      type: opengraphType,
      siteName: opengraphSiteName,
      publishedTime: opengraphPublishedTime,
      modifiedTime: opengraphModifiedTime,
      authors: [opengraphAuthor],
      images: opengraphImage
        ? [
            {
              url: opengraphImage.sourceUrl,
              alt: opengraphImage.altText,
              width: opengraphImage.mediaDetails.width,
              height: opengraphImage.mediaDetails.height,
              type: opengraphImage.mimeType,
            },
          ]
        : [],
    },
    twitter: {
      title: twitterTitle,
      description: twitterDescription,
      images: opengraphImage
        ? [
            {
              url: twitterImage.sourceUrl,
              alt: twitterImage.altText,
              width: twitterImage.mediaDetails.width,
              height: twitterImage.mediaDetails.height,
              type: twitterImage.mimeType,
            },
          ]
        : [],
    },
  };
}
