import { NextRequest, NextResponse } from 'next/server';

const { ALGOLIA_APP_ID: appId, ALGOLIA_KEY_ADMIN: key } = process.env;

export const config = {
  runtime: 'edge',
  regions: ['sin1'],
};

export default async function handler(req: NextRequest) {
  try {
    const params = new URL(req.url).searchParams;
    const result = await fetch(
      `https://${appId}-dsn.algolia.net/1/indexes/wp_post?` +
        new URLSearchParams({
          query: params.get('q'),
          page: String(Number(params.get('page')) - 1),
          hitsPerPage: String(Math.min(100, Number(params.get('pageSize')))),
          attributesToHighlight: 'title',
          attributesToRetrieve: 'slug,thumbnail,title',
          attributesToSnippet: 'content:40,excerpt:40',
          userToken: req.ip,
        }),
      {
        headers: {
          'X-Algolia-API-Key': key,
          'X-Algolia-Application-Id': appId,
        },
      },
    ).then(res => res.json());
    const { hits } = result;
    return NextResponse.json({ hits });
  } catch (error) {
    return new NextResponse(null, { status: 503 });
  }
}
