import { gql } from 'graphql-request';

export const CategorySliderData = gql`
  fragment CategorySliderData on Category_Slider {
    posts {
      ... on Post {
        title
        uri
        thumbnails {
          thumbnailSlideSquare {
            ...HeroImageData
          }
          thumbnailSlideWidescreen {
            ...HeroImageData
          }
        }
      }
      ... on Page {
        title
        uri
        thumbnails {
          thumbnailSlideSquare {
            ...HeroImageData
          }
          thumbnailSlideWidescreen {
            ...HeroImageData
          }
        }
      }
    }
  }
`;

export const CollectionData = gql`
  fragment CollectionData on Category_Collections_items {
    posts {
      ... on Post {
        slug
        ...PostCardData
      }
      ... on Page {
        slug
        ...PostCardData
      }
    }
  }
`;

export const CommentThreadCommentData = gql`
  fragment CommentThreadCommentData on Comment {
    content
    databaseId
    dateGmt
    parentId
    id
    author {
      node {
        id
        name
        ... on User {
          avatar {
            url
          }
        }
      }
    }
  }
`;

export const HeroImageData = gql`
  fragment HeroImageData on MediaItem {
    altText
    id
    sourceUrl
    mediaDetails {
      height
      width
    }
  }
`;

export const MapData = gql`
  fragment MapData on Category_Map {
    description
    title
    mid
  }
`;

export const PostCardData = gql`
  fragment PostCardData on ContentNode {
    uri
    slug
    ... on NodeWithExcerpt {
      excerpt
    }
    ... on NodeWithFeaturedImage {
      featuredImage {
        node {
          altText
          id
          srcLarge: sourceUrl(size: LARGE)
          slug
        }
      }
    }
    ... on NodeWithTitle {
      title
    }
  }
`;

export const PostMediaBlockData = gql`
  fragment PostMediaBlockData on ContentNode {
    slug
    uri
    ... on NodeWithExcerpt {
      excerpt
    }
    ... on NodeWithFeaturedImage {
      featuredImage {
        node {
          altText
          srcMedium: sourceUrl(size: MEDIUM)
          slug
        }
      }
    }
    ... on NodeWithTitle {
      title
    }
    ... on Page {
      seo {
        metaDesc
      }
    }
    ... on Post {
      categories(where: { exclude: 154 }) {
        nodes {
          name
          uri
        }
      }
    }
  }
`;
