import { NextResponse } from 'next/server';
import { BlobNotFoundError, head, put } from '@vercel/blob';
import { createHash } from 'crypto';

// Implementation: https://gemini.google.com/app/47f750ffbb4bbac6

export const runtime = 'nodejs';

const CLOUDINARY_CLOUD_NAME = 'do6frqzl2';
const ALLOWED_DOMAIN = 'cms.vietnamcoracle.com';

function keyFromUrl(url: string) {
  const hash = createHash('sha256').update(`${url}|f_mp4|q_auto`).digest('hex');
  return `gif-to-video/${hash}.mp4`;
}

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

  const key = keyFromUrl(gifUrl);

  try {
    const res = await head(key);
    const existingUrl = res.url;

    if (existingUrl) {
      return NextResponse.redirect(existingUrl, {
        status: 308,
        headers: {
          'Cache-Control': 'public, s-maxage=31536000, immutable',
        },
      });
    }
  } catch (error) {
    if (error instanceof BlobNotFoundError) {
      console.log('Blob not found, creating new one:', { key });
    } else {
      throw error;
    }
  }

  // fetch transformed MP4 from Cloudinary and persist
  const videoUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/fetch/f_mp4,q_auto/${gifUrl}`;

  const upstream = await fetch(videoUrl, { redirect: 'follow' });

  if (!upstream.ok || upstream.body === null) {
    const message = await upstream.text().catch(() => 'Upstream fetch failed');
    return NextResponse.json(
      { error: 'Failed to fetch transformed video.', details: message },
      { status: upstream.status || 502 },
    );
  }

  // stream upload to blob storage
  const contentType = upstream.headers.get('content-type') || 'video/mp4';

  const uploaded = await put(key, upstream.body, {
    access: 'public',
    contentType,
    addRandomSuffix: false,
  });

  // redirect clients to the durable, edge-cached asset
  return NextResponse.redirect(uploaded.url, {
    status: 308,
    headers: {
      'Cache-Control': 'public, s-maxage=31536000, immutable',
    },
  });
}
