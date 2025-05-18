import { gql } from 'graphql-request';
import { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import Post from '../../components/Post';
import GraphQLClient from '../../lib/WPGraphQLClient';
import fetchFirstValidId from '../../lib/fetchFirstValidId';
import getSEOMetadata from '../../lib/getSEOMetadata';
import preparePostData from '../../lib/preparePostData';
import PostQuery from '../../queries/Post.gql';
import PostMetadataQuery from '../../queries/PostMetadata.gql';
import SidebarQuery from '../../queries/Sidebar.gql';
import MenuQuery from '../../queries/Menu.gql';
import { redirect } from 'next/navigation';
import Menu from '../../components/Menu';

export const dynamic = 'force-static';
export const revalidate = false;

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function SSGPost({ params }: Props) {
  const { slug } = await params;
  const databaseId = await fetchFirstValidId(slug, ['posts', 'pages']);

  if (!databaseId) {
    return notFound();
  }

  const { isEnabled: preview } = await draftMode();

  const api = new GraphQLClient(preview ? 'preview' : 'admin');

  const [postData, blockData, menuData] = await Promise.all([
    api.request(PostQuery, {
      preview,
      id: databaseId,
      idType: 'DATABASE_ID',
    }),
    api.request(SidebarQuery),
    api.request(MenuQuery),
  ]);

  if (
    postData.contentNode?.status === 'private' ||
    postData.contentNode?.patreonLevel > 0
  ) {
    return redirect(`/post/?p=${postData.contentNode.databaseId}`);
  }

  if (
    !postData.contentNode ||
    !['post', 'page'].includes(postData.contentNode.contentType?.node.name)
  ) {
    console.warn(
      'contentNode not found for database id, or contentType is not a post or page:',
      postData.contentNode,
    );
    return notFound();
  }

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

export async function generateMetadata({ params }): Promise<Metadata> {
  const { slug } = await params;

  try {
    const databaseId = await fetchFirstValidId(slug, ['posts', 'pages']);

    if (!databaseId) return { title: 'Not Found' };

    const api = new GraphQLClient('admin');

    const data = await api.request(PostMetadataQuery, {
      preview: false,
      id: databaseId,
      idType: 'DATABASE_ID',
    });

    return getSEOMetadata(data.contentNode.seo);
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error',
    };
  }
}

export async function generateStaticParams() {
  const api = new GraphQLClient('admin');

  const data = await api.request(gql`
    {
      contentNodes(first: 1000, where: { contentTypes: [PAGE, POST] }) {
        nodes {
          ... on ContentNode {
            uri
          }
        }
      }
    }
  `);

  return data.contentNodes.nodes.map(node => ({
    slug: node.uri.split('/').filter(token => Boolean(token))[0],
  }));
}
