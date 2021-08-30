import axios from 'axios';
import { gql } from 'graphql-request';
import { GetServerSidePropsContext } from 'next';
import nodeCookie from 'node-cookie';
import PatronOnlyContentGate from '../components/PatronOnlyContentGate';
import Post, { POST_QUERY, getPostPageProps } from '../components/Post';
import getGQLClient from '../lib/getGQLClient';

// This is a server-rendered page for posts for when logic is necessary in order to display the post or redirect
export default function SSRPost(props) {
  if (props.renderPatreonButton) {
    return <PatronOnlyContentGate />;
  }
  if (props.post) {
    return (
      <Post
        data={props.post.data}
        html={props.post.html}
        postNav={props.post.postNav}
      />
    );
  }
  return null;
}

export async function getServerSideProps({
  preview,
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

  const api = getGQLClient('admin');
  const data = await api.request(
    gql`
      query PostById($id: ID!) {
        contentNode(id: $id, idType: DATABASE_ID) {
          patreonLevel
          isRestricted
          uri
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
  let userCanView = preview;

  // Patreon-only content requires OAuth token
  if (data.contentNode.patreonLevel > 0) {
    const token = nodeCookie.get(req, 'patreon_token');
    if (token) {
      try {
        const result = await axios.get(
          '/identity?include=memberships&fields%5Bmember%5D=currently_entitled_amount_cents,patron_status',
          {
            baseURL: 'https://www.patreon.com/api/oauth2/v2',
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        // console.log('data', JSON.stringify(result.data.data, null, 2));
        if (
          result.data.included[0]?.attributes?.patron_status ===
            'active_patron' &&
          data.contentNode.patreonLevel * 100 >=
            result.data.included[0]?.attributes?.currently_entitled_amount_cents
        ) {
          userCanView = true;
        }
      } catch (error) {
        console.error(
          'Failed to request Patreon membership data:',
          error.message,
        );
      }
    } else {
      // No token, show login with patreon button
      return { props: { renderPatreonButton: true } };
    }
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
