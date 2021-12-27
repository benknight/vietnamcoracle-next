import { gql } from 'graphql-request';

export const BlockData = gql`
  fragment BlockData on Block_Block {
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
`;

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
    }
  }
`;

export const CommentThreadCommentData = gql`
  fragment CommentThreadCommentData on Comment {
    content
    commentId
    dateGmt
    parentId
    id
    author {
      node {
        email
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

export const FooterData = gql`
  fragment FooterData on RootQuery {
    footerMenu: menu(id: "dGVybTo0MDk=") {
      menuItems {
        nodes {
          path
          label
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
          __typename
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

export const SidebarDefaultData = gql`
  fragment SidebarDefaultData on RootQuery {
    about: block(id: "cG9zdDozNjExOA==", asPreview: $preview) {
      ...Block
    }
    subscribe: block(id: "cG9zdDozNzcwNQ==", asPreview: $preview) {
      ...Block
    }
    support: block(id: "cG9zdDozNzY4Nw==", asPreview: $preview) {
      ...Block
    }
  }
  fragment Block on Block {
    block {
      ...BlockData
    }
  }
`;
