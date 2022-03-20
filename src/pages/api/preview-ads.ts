import type { NextApiRequest, NextApiResponse } from 'next';

export default async function preview(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { secret, redirect } = req.query;

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({
    ads: {
      header: {
        enabled: true,
        html: `<a href="https://www.vietnamcoracle.com/"><img alt="placeholder" src="https://fakeimg.pl/1000x100/?text=SAMPLE&font=noto"></a>`,
      },
      collection: [
        {
          body: 'This is the ad body content. Use this to describe your product or service.',
          enabled: true,
          heading: 'Sample Advertisement',
          position: 4,
          cta: {
            title: 'Call to Action',
            url: 'https://www.vietnamcoracle.com',
          },
          image: {
            altText: '',
            srcLarge: 'https://fakeimg.pl/1024x1024/?text=SAMPLE&font=noto',
          },
        },
      ],
    },
  });

  // Redirect to the path provided
  res.writeHead(307, { Location: redirect || '/' });
  res.end();
}
