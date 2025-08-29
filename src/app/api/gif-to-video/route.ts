import { NextResponse } from 'next/server';

// Implementation: https://gemini.google.com/app/47f750ffbb4bbac6

const CLOUDINARY_CLOUD_NAME = 'dbyqqtb34';
const ALLOWED_DOMAIN = 'cms.vietnamcoracle.com';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const gifUrl = searchParams.get('url');

  if (!gifUrl) {
    return NextResponse.json(
      { error: 'URL parameter is required.' },
      { status: 400 },
    );
  }

  try {
    const urlObject = new URL(gifUrl);

    if (
      urlObject.hostname !== ALLOWED_DOMAIN ||
      !urlObject.pathname.endsWith('.gif')
    ) {
      return NextResponse.json(
        { error: 'Invalid or disallowed URL.' },
        { status: 400 },
      );
    }
  } catch (error) {
    return NextResponse.json({ error: 'Invalid URL format.' }, { status: 400 });
  }

  const videoUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/fetch/f_mp4,q_auto/${gifUrl}`;

  return NextResponse.redirect(videoUrl, {
    status: 307,
    headers: {
      'Cache-Control': 's-maxage=31536000, stale-while-revalidate',
    },
  });
}
