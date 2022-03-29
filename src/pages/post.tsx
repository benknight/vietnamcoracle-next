import axios from 'axios';
import { gql } from 'graphql-request';
import { GetServerSidePropsContext } from 'next';
import nodeCookie from 'node-cookie';
import { useEffect } from 'react';
import PatronOnlyContentGate from '../components/PatronOnlyContentGate';
import Post, { POST_QUERY, getPostPageProps } from '../components/Post';
import getGQLClient from '../lib/getGQLClient';

// This is a server-rendered page for posts for when logic is necessary in order to display the post or redirect
export default function SSRPost({ patron, post, renderPatreonButton = false }) {
  useEffect(() => {
    if (post) {
      window.history.replaceState(
        null,
        null,
        `${window.location.origin}${post.data.contentNode.uri}`,
      );
    }
  }, [post]);

  if (renderPatreonButton) {
    return (
      <PatronOnlyContentGate
        patron={patron}
        patreonLevel={post?.data.contentNode.patreonLevel}
      />
    );
  }

  if (post) {
    return <Post data={post.data} html={post.html} postNav={post.postNav} />;
  }

  return null;
}

export async function getServerSideProps({
  preview,
  previewData,
  query,
  req,
}: GetServerSidePropsContext) {
  const postId = query.p || query.state;

  if (!postId) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    };
  }

  const api = getGQLClient(preview ? 'preview' : 'admin');
  const data = await api.request(
    gql`
      query PostById($id: ID!) {
        contentNode(id: $id, idType: DATABASE_ID) {
          patreonLevel
          isRestricted
          uri
          status
        }
      }
    `,
    {
      id: postId,
    },
  );

  // No such post exists, return 404
  if (!data.contentNode) {
    return {
      notFound: true,
    };
  }

  // Determine if current user can view restricted content
  let isRestricted =
    data.contentNode.status !== 'publish' ||
    data.contentNode.isRestricted ||
    data.contentNode.patreonLevel > 0;
  let userCanView = (previewData as any)?.isAdminPreview;
  let renderPatreonButton = false;

  // Patreon-only content requires OAuth token
  if (data.contentNode.patreonLevel > 0) {
    const token = nodeCookie.get(req, 'patreon_token');
    if (token) {
      try {
        const result = await axios.get(
          '/identity?include=memberships' +
            '&fields%5Bmember%5D=currently_entitled_amount_cents,patron_status' +
            '&fields%5Buser%5D=full_name,email',
          {
            baseURL: 'https://www.patreon.com/api/oauth2/v2',
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (
          result.data.included?.[0]?.attributes?.patron_status ===
            'active_patron' &&
          result.data.included?.[0]?.attributes
            ?.currently_entitled_amount_cents >=
            data.contentNode.patreonLevel * 100
        ) {
          userCanView = true;
        } else {
          return {
            props: {
              patron: {
                email: result.data.data.attributes?.email ?? null,
                name: result.data.data.attributes?.full_name ?? null,
              },
              post: {
                data,
              },
              renderPatreonButton: true,
            },
          };
        }
      } catch (error) {
        renderPatreonButton = true;
      }
    } else {
      renderPatreonButton = true;
    }
  }

  if (renderPatreonButton) {
    return {
      props: {
        post: {
          data,
        },
        renderPatreonButton: true,
      },
    };
  }

  if (isRestricted) {
    if (userCanView) {
      const postData = await api.request(POST_QUERY, {
        preview: Boolean(preview),
        id: data.contentNode.uri,
      });
      return {
        props: {
          post: await getPostPageProps(postData, Boolean(preview)),
          preview: Boolean(preview),
        },
      };
    } else {
      return {
        notFound: true,
      };
    }
  }

  // By default 301 to canonical post urls
  return {
    redirect: {
      destination: data.contentNode?.uri,
      permanent: true,
    },
  };
}
