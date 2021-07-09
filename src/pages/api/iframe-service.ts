import type { NextApiRequest, NextApiResponse } from 'next';

export default async function iframeService(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  let html: string;
  try {
    html = decodeURIComponent(String(req.query.html));
  } catch (error) {
    res.status(400).send('Failed to parse HTML');
    return;
  }
  res.setHeader('Content-Type', 'text/html');
  res.send(
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
  );
}
