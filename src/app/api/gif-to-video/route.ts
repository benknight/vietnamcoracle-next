import { NextResponse } from 'next/server';

const CLOUDINARY_CLOUD_NAME = 'dbyqqtb34';
const ALLOWED_DOMAIN = 'cms.vietnamcoracle.com';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const gifUrl = searchParams.get('url');

  if (!gifUrl) {
    return NextResponse.json(
      { error: 'URL parameter is required.' },
      { status: 400 },
    );
  }

  let urlObject: URL | null = null;

  try {
    urlObject = new URL(gifUrl);

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

  // Proxy the transformed video instead of redirecting, so the CDN can cache it.
  const range = request.headers.get('range') || undefined;

  const upstream = await fetch(videoUrl, {
    headers: range ? { Range: range } : undefined,
    redirect: 'follow',
  });

  if (!(upstream.ok || upstream.status === 206)) {
    const message = await upstream.text().catch(() => 'Upstream fetch failed');

    return NextResponse.json(
      { error: 'Failed to fetch transformed video.', details: message },
      { status: upstream.status || 502 },
    );
  }

  const headers = new Headers();

  // Preserve important upstream headers
  const ct = upstream.headers.get('content-type') || 'video/mp4';
  const cl = upstream.headers.get('content-length');
  const cr = upstream.headers.get('content-range');
  const ar = upstream.headers.get('accept-ranges');
  const etag = upstream.headers.get('etag');
  const lm = upstream.headers.get('last-modified');

  headers.set('Content-Type', ct);

  if (cl) headers.set('Content-Length', cl);
  if (cr) headers.set('Content-Range', cr);
  if (ar) headers.set('Accept-Ranges', ar);
  if (etag) headers.set('ETag', etag);
  if (lm) headers.set('Last-Modified', lm);

  // Strong shared cache so the CDN stores the proxied bytes after first request
  headers.set(
    'Cache-Control',
    'public, s-maxage=31536000, stale-while-revalidate',
  );

  headers.set('CDN-Cache-Control', 'public, s-maxage=31536000');
  headers.set('Vary', 'Range, Accept-Encoding');

  // Provide a stable inline filename
  try {
    const base = urlObject
      ? urlObject.pathname.split('/').pop() || 'file.gif'
      : 'file.gif';
    const mp4Name = base.replace(/\.gif$/i, '.mp4');
    headers.set('Content-Disposition', `inline; filename="${mp4Name}"`);
  } catch {}

  return new Response(upstream.body, {
    status: upstream.status,
    headers,
  });
}
