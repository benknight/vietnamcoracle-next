import { gql } from 'graphql-request';
import * as fragments from '../config/fragments';

export const POST_QUERY = gql`
  query Post($preview: Boolean!, $id: ID!, $idType: ContentNodeIdTypeEnum!) {
    globalStylesheet
    contentNode(id: $id, idType: $idType) {
      ... on ContentNode {
        databaseId
        isRestricted
        link
        patreonLevel
        status
        uri
        contentType {
          node {
            name
          }
        }
        customRelatedPosts(first: 100) {
          nodes {
            ...PostCardData
          }
        }
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
        commentStatus
        comments(first: 1000) {
          nodes {
            ...CommentThreadCommentData
          }
        }
        preview @include(if: $preview) {
          node {
            content
            title
          }
        }
        seo {
          fullHead
        }
        thumbnails {
          thumbnailHeader {
            ...HeroImageData
          }
          thumbnailHeaderSquare {
            ...HeroImageData
          }
        }
      }
      ... on Post {
        commentStatus
        categories(where: { exclude: 154, orderby: COUNT, order: ASC }) {
          nodes {
            name
            uri
            ads {
              header {
                enabled
                html
              }
            }
          }
        }
        navCategory: categories(
          where: { parent: 154, orderby: COUNT, order: DESC } # Pick first category with most posts
        ) {
          nodes {
            slug
          }
        }
        comments(first: 1000) {
          nodes {
            ...CommentThreadCommentData
          }
        }
        preview @include(if: $preview) {
          node {
            content
            title
          }
        }
        seo {
          fullHead
        }
        settings {
          useNextStyles
        }
        tags(where: { orderby: NAME, order: ASC }) {
          nodes {
            name
            uri
          }
        }
        thumbnails {
          thumbnailHeader {
            ...HeroImageData
          }
          thumbnailHeaderSquare {
            ...HeroImageData
          }
        }
      }
    }
    defaultImages {
      cover {
        large {
          ...HeroImageData
        }
        small {
          ...HeroImageData
        }
      }
    }
  }
  ${fragments.CommentThreadCommentData}
  ${fragments.HeroImageData}
  ${fragments.PostCardData}
`;
