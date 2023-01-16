import { NextRequest, NextResponse } from 'next/server';

const { ALGOLIA_APP_ID: appId, ALGOLIA_KEY_ADMIN: key } = process.env;

export const config = {
  runtime: 'experimental-edge',
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
        }),
      {
        headers: {
          'X-Algolia-Application-Id': appId,
          'X-Algolia-API-Key': key,
          'X-Forwarded-For': req.ip.split(',')[0],
        },
      },
    ).then(res => res.json());
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.error();
  }
}
