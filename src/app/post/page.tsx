import { gql } from 'graphql-request';
import { notFound, permanentRedirect } from 'next/navigation';
import { cookies, draftMode } from 'next/headers';
import WPGraphQLClient from '@/lib/WPGraphQLClient';
import preparePostData from '@/lib/preparePostData';
import PostQuery from '@/queries/Post.gql';
import SidebarQuery from '@/queries/Sidebar.gql';
import MenuQuery from '@/queries/Menu.gql';
import PatronOnlyContentGate from '@/components/PatronOnlyContentGate';
import Header from '@/components/Header';
import Menu from '@/components/Menu';
import Post from '@/components/Post';

interface Props {
  searchParams: Promise<{ p?: string; state?: string }>;
}

export default async function SSRPost({ searchParams }: Props) {
  const { p, state } = await searchParams;
  const { isEnabled: preview } = await draftMode();
  const cookieStore = await cookies();

  const postId = p || state;

  if (!postId) {
    return permanentRedirect('/');
  }

  const api = new WPGraphQLClient(
    preview ? 'preview' : 'admin',
    preview ? {} : { next: { revalidate: 60 * 60 * 1 } },
  );

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
    return notFound();
  }

  const isAdminPreview =
    preview && cookieStore.get('isAdminPreview')?.value === '1';

  let isRestricted =
    data.contentNode.status !== 'publish' ||
    data.contentNode.isRestricted ||
    data.contentNode.patreonLevel > 0;

  let userCanView = process.env.NODE_ENV === 'development' || isAdminPreview;

  let renderPatreonButton = false;

  const minPatreonLevel = data.contentNode.patreonLevel;

  const gateProps: React.ComponentProps<typeof PatronOnlyContentGate> = {
    patreonLevel: minPatreonLevel,
    returnTo: `/post/?p=${postId}`,
  };

  if (minPatreonLevel > 0) {
    const token = cookieStore.get('patreon_token');

    if (token) {
      try {
        const response = await fetch(
          'https://www.patreon.com/api/oauth2/v2/identity?include=memberships' +
            '&fields%5Bmember%5D=currently_entitled_amount_cents,patron_status' +
            '&fields%5Buser%5D=full_name,email',
          {
            headers: { Authorization: `Bearer ${token.value}` },
          },
        );

        const result = await response.json();

        console.log(
          'Response received from Patreon API',
          JSON.stringify(result),
        );

        if (!response.ok) {
          throw new Error('Error fetching Patreon identity');
        }

        const membership = result.included?.[0]?.attributes;

        if (
          membership &&
          membership.patron_status === 'active_patron' &&
          membership.currently_entitled_amount_cents >= minPatreonLevel * 100
        ) {
          userCanView = true;
        } else {
          renderPatreonButton = true;

          gateProps.patron = {
            email: result.data.attributes?.email ?? null,
            name: result.data.attributes?.full_name ?? null,
          };
        }
      } catch (error) {
        console.error(error);
        renderPatreonButton = true;
      }
    } else {
      renderPatreonButton = true;
    }
  }

  const menuPromise = api.request(MenuQuery);

  if (renderPatreonButton) {
    return (
      <>
        <Header
          menu={<Menu data={await menuPromise} fullWidth />}
          preview={preview}
          fullWidth
        />
        <PatronOnlyContentGate {...gateProps} />
      </>
    );
  }

  // TODO: this could create a redirect loop
  if (!isRestricted) {
    return permanentRedirect(
      // Encode any special characters in the URL
      data.contentNode?.uri.split('/').map(encodeURIComponent).join('/'),
    );
  }

  if (isRestricted && !userCanView) {
    return notFound();
  }

  const [postData, blockData, menuData] = await Promise.all([
    api.request(PostQuery, {
      preview: Boolean(preview),
      id: postId,
      idType: 'DATABASE_ID',
    }),
    api.request(SidebarQuery),
    menuPromise,
  ]);

  const post = await preparePostData(postData, blockData, preview);

  return (
    <Post
      menu={<Menu data={menuData} fullWidth />}
      post={post}
      preview={preview}
      sidebarBlocks={blockData}
    />
  );
}
