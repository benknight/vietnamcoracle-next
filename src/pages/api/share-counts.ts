import { NextRequest, NextResponse } from 'next/server';

export const config = {
  runtime: 'experimental-edge',
};

export default async function handler(req: NextRequest) {
  try {
    const params = new URL(req.url).searchParams;
    const result = await fetch(
      `https://graph.facebook.com/v10.0/?` +
        new URLSearchParams({
          access_token: process.env.FACEBOOK_ACCESS_TOKEN,
          fields: 'og_object{engagement}',
          id: params.get('link'),
        }),
    ).then(res => res.json());
    if (result.error) {
      console.error(result);
      throw new Error(result.error.message);
    }
    return new NextResponse(
      JSON.stringify({
        facebook: result.og_object?.engagement?.count ?? 0,
      }),
      {
        status: 200,
        headers: {
          'content-type': 'application/json',
          'cache-control': 'public, s-maxage=3600, stale-while-revalidate=3600',
        },
      },
    );
  } catch (error) {
    return new NextResponse(null, {
      status: 503,
    });
  }
}
