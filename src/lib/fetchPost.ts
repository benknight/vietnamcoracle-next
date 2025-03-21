'use server';
import { POST_QUERY } from '../config/queries';
import getGQLClient from './getGQLClient';
import { getPostPageProps } from './getPostPageProps';

export async function fetchPost(databaseId: string, preview = false) {
  try {
    const api = getGQLClient(preview ? 'preview' : 'admin');
    const data = await api.request(POST_QUERY, {
      preview,
      id: databaseId,
      idType: 'DATABASE_ID',
    });

    return await getPostPageProps(data, preview);
  } catch (error) {
    console.error('Error fetching post:', error);
    throw new Error('Failed to fetch post');
  }
}
