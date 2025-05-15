import { NextRequest, NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest) {
  const params = new URL(req.url).searchParams;

  let html = params.get('html');

  if (!html) {
    return new NextResponse(null, {
      status: 400,
    });
  }

  try {
    html = decodeURIComponent(html);
  } catch (error) {
    return new NextResponse('Failed to parse HTML', {
      status: 400,
    });
  }

  return new NextResponse(
    `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width">
    <meta charset="utf-8">
    <style>
      body {
        display: flex;
        justify-content: center;
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    ${html}
  </body>
</html>`,
    {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    },
  );
}
