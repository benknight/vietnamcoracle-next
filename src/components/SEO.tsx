import { gql } from 'graphql-request';
import Head from 'next/head';

export default function SEO(props: any) {
  return (
    <Head>
      <meta name="description" content={props.metaDesc} />
      <meta
        name="robots"
        content={`${props.metaRobotsNoindex}, ${props.metaRobotsNofollow}`}
      />
      <meta
        property="article:published_time"
        content={props.opengraphPublishedTime}
      />
      <meta
        property="article:modified_time"
        content={props.opengraphModifiedTime}
      />
      <meta property="og:description" content={props.opengraphDescription} />
      {props.opengraphImage && (
        <>
          <meta property="og:image" content={props.opengraphImage.sourceUrl} />
          <meta
            property="og:image:height"
            content={props.opengraphImage.mediaDetails.height}
          />
          <meta
            property="og:image:width"
            content={props.opengraphImage.mediaDetails.width}
          />
        </>
      )}
      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content={props.opengraphSiteName} />
      <meta property="og:type" content={props.opengraphType} />
      <meta property="og:url" content={props.opengraphUrl} />
      <meta name="twitter:title" content={props.twitterTitle} />
      <meta name="twitter:description" content={props.twitterDescription} />
      {props.twitterImage && (
        <>
          <meta
            property="twitter:image"
            content={props.twitterImage?.sourceUrl}
          />
          <meta name="twitter:card" content="summary_large_image" />
        </>
      )}
      {props.readingTime && (
        <>
          <meta name="twitter:label2" content="Est. reading time" />
          <meta name="twitter:data2" content={props.readingTime} />
        </>
      )}
      {props.children}
      <title>{props.title}</title>
      <link rel="canonical" href={props.canonical} />
      {props.schema && (
        <script type="application/ld+json" className="yoast-schema-graph">
          {props.schema.raw}
        </script>
      )}
    </Head>
  );
}

SEO.fragments = {
  category: gql`
    fragment SEOCategoryData on TaxonomySEO {
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
  `,
  post: gql`
    fragment SEOPostData on PostTypeSEO {
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
  `,
};
