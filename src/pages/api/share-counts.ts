import { NextRequest, NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest) {
  try {
    const params = new URL(req.url).searchParams;
    const url = params.get('link');

    if (!url) {
      return new NextResponse(null, {
        status: 400,
      });
    }

    const token = process.env.FACEBOOK_ACCESS_TOKEN;

    if (!token) {
      return new NextResponse('Facebook access token not defined', {
        status: 500,
      });
    }

    const result = await fetch(
      `https://graph.facebook.com/v20.0/?` +
        new URLSearchParams({
          access_token: token,
          fields: 'engagement',
          id: url,
        }),
    ).then(res => res.json());

    return new NextResponse(
      JSON.stringify({
        facebook:
          (result.engagement?.share_count ?? 0) +
          (result.engagement?.comment_count ?? 0) +
          (result.engagement?.reaction_count ?? 0),
      }),
      {
        status: 200,
        headers: {
          'content-type': 'application/json',
          'cache-control':
            'public, max-age=3600, s-maxage=3600, stale-while-revalidate=3600',
        },
      },
    );
  } catch (error) {
    console.error(error);

    return new NextResponse(null, {
      status: 503,
    });
  }
}
