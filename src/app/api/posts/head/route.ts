import { gql } from 'graphql-request';
import { NextRequest, NextResponse } from 'next/server';
import getGQLClient from '../../../../lib/getGQLClient';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Missing ID parameter' },
      { status: 400 },
    );
  }

  try {
    const api = getGQLClient('admin');
    const query = gql`
      query GetPostHead($id: ID!) {
        contentNode(id: $id, idType: DATABASE_ID) {
          seo {
            fullHead
          }
          databaseId
        }
      }
    `;

    const data = await api.request(query, { id });

    return NextResponse.json({
      head: data.contentNode?.seo?.fullHead || '',
    });
  } catch (error) {
    console.error('Error fetching post head:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post head' },
      { status: 500 },
    );
  }
}
