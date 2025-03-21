import '../styles/wp-global.css';
import '../styles/fonts.css';
import '../styles/global.css';
import '../styles/wp-blocks.css';
import '../custom-elements';
import type { Metadata } from 'next';
import Script from 'next/script';
import type { ReactNode } from 'react';
import MuiProviders from '../components/MuiProviders';
import Header from '../components/Header';
import { draftMode } from 'next/headers';

interface Props {
  children: ReactNode;
}

export default async function AppLayout({ children }: Props) {
  const { isEnabled } = await draftMode();

  return (
    <html lang="en">
      <head>
        {/* Global Site Tag (gtag.js) - Google Analytics */}
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
        />
        <Script
          dangerouslySetInnerHTML={{
            __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
                  page_path: window.location.pathname,
                });
              `,
          }}
        />
        {/* Goat Counter */}
        <Script
          data-goatcounter="https://coracle.goatcounter.com/count"
          async
          src="//gc.zgo.at/count.js"></Script>
        {/* Handle global scripts for posts here */}
        <Script
          src="https://cms.vietnamcoracle.com/wp-content/plugins/stackable-ultimate-gutenberg-blocks/dist/frontend_blocks.js"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <MuiProviders>
          <div className="relative bg-white dark:bg-gray-950 min-h-screen">
            <Header preview={isEnabled} fullWidth />
            {children}
          </div>
        </MuiProviders>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: 'Vietnam Coracle',
  applicationName: 'Vietnam Coracle',
  icons: {
    // Standard icons
    icon: [
      { url: '/favicon-196x196.png', sizes: '196x196', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-128.png', sizes: '128x128', type: 'image/png' },
    ],
    // Apple touch icons with precomposed rel
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon-57x57.png',
        sizes: '57x57',
      },
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon-114x114.png',
        sizes: '114x114',
      },
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon-72x72.png',
        sizes: '72x72',
      },
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon-144x144.png',
        sizes: '144x144',
      },
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon-60x60.png',
        sizes: '60x60',
      },
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon-120x120.png',
        sizes: '120x120',
      },
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon-76x76.png',
        sizes: '76x76',
      },
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon-152x152.png',
        sizes: '152x152',
      },
    ],
  },
  // Microsoft-specific configurations
  other: {
    'msapplication-TileColor': '#FFFFFF',
    'msapplication-TileImage': '/mstile-144x144.png',
    'msapplication-square70x70logo': '/mstile-70x70.png',
    'msapplication-square150x150logo': '/mstile-150x150.png',
    'msapplication-wide310x150logo': '/mstile-310x150.png',
    'msapplication-square310x310logo': '/mstile-310x310.png',
  },
};
