import '../styles/fonts.css';
import '../styles/global.css';
import '../styles/article.css';
import '../custom-elements';
import cx from 'classnames';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import smoothscroll from 'smoothscroll-polyfill';
import CircularProgress from '@mui/material/CircularProgress';
import {
  ThemeProvider,
  StyledEngineProvider,
  createTheme,
} from '@mui/material/styles';
import Header from '../components/Header';
import { pageview } from '../lib/GoogleAnalytics';
import checkHomePath from '../lib/checkHomePath';
import { NavCategory } from '../lib/useNavCategory';
import useWaitCursor from '../lib/useWaitCursor';

const theme = createTheme();

if (typeof window !== 'undefined') {
  smoothscroll.polyfill();
}

type PageProps = {
  ads: {
    header: {
      enabled: boolean;
      html: string;
    };
  };
  navCategory: string;
  preview: boolean;
};

function MyApp({ Component, pageProps }: AppProps<PageProps>) {
  const { preview } = pageProps;
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const ads = pageProps.ads;
  const isBrowsePath = router.pathname === '/browse/[[...browse]]';
  const isHomePath = checkHomePath(router.asPath);
  const navCategory = useMemo(() => {
    if (pageProps?.navCategory) return pageProps.navCategory;
    if (router.query.ref) return router.query.ref;
    if (isBrowsePath) {
      if (isHomePath) {
        return null;
      }
      return router.query.browse?.[0];
    }
  }, [pageProps, router.query]);

  useEffect(() => {
    const routeChangeStart = () => setLoading(true);
    const routeChangeComplete = () => setLoading(false);
    const routeChangeError = () => setLoading(false);
    router.events.on('routeChangeStart', routeChangeStart);
    router.events.on('routeChangeComplete', routeChangeComplete);
    router.events.on('routeChangeError', routeChangeError);
    return () => {
      router.events.off('routeChangeStart', routeChangeStart);
      router.events.off('routeChangeComplete', routeChangeComplete);
      router.events.off('routeChangeError', routeChangeError);
    };
  }, []);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      pageview(url);
    };
    // When the component is mounted, subscribe to router changes
    // and log those page views
    router.events.on('routeChangeComplete', handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  useEffect(() => {
    const clickHandler = (event: MouseEvent) => {
      const target = event.target as Element;
      const anchorElement = target.closest('a');

      if (!anchorElement) return;
      if (!anchorElement.classList.contains('gofollow')) return;
      if (!anchorElement.hasAttribute('data-track')) return;

      const trackData = anchorElement.getAttribute('data-track');

      if (trackData) {
        fetch('https://cms.vietnamcoracle.com/wp-admin/admin-ajax.php', {
          method: 'post',
          body: new URLSearchParams({
            action: 'adrotate_click',
            track: trackData,
          }),
        });
      }
    };

    document.body.addEventListener('click', clickHandler);

    return () => document.body.removeEventListener('click', clickHandler);
  }, []);

  useWaitCursor(loading);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Head>
          <title>Vietnam Coracle</title>
          <link
            rel="apple-touch-icon-precomposed"
            sizes="57x57"
            href="/apple-touch-icon-57x57.png"
          />
          <link
            rel="apple-touch-icon-precomposed"
            sizes="114x114"
            href="/apple-touch-icon-114x114.png"
          />
          <link
            rel="apple-touch-icon-precomposed"
            sizes="72x72"
            href="/apple-touch-icon-72x72.png"
          />
          <link
            rel="apple-touch-icon-precomposed"
            sizes="144x144"
            href="/apple-touch-icon-144x144.png"
          />
          <link
            rel="apple-touch-icon-precomposed"
            sizes="60x60"
            href="/apple-touch-icon-60x60.png"
          />
          <link
            rel="apple-touch-icon-precomposed"
            sizes="120x120"
            href="/apple-touch-icon-120x120.png"
          />
          <link
            rel="apple-touch-icon-precomposed"
            sizes="76x76"
            href="/apple-touch-icon-76x76.png"
          />
          <link
            rel="apple-touch-icon-precomposed"
            sizes="152x152"
            href="/apple-touch-icon-152x152.png"
          />
          <link
            rel="icon"
            type="image/png"
            href="/favicon-196x196.png"
            sizes="196x196"
          />
          <link
            rel="icon"
            type="image/png"
            href="/favicon-96x96.png"
            sizes="96x96"
          />
          <link
            rel="icon"
            type="image/png"
            href="/favicon-32x32.png"
            sizes="32x32"
          />
          <link
            rel="icon"
            type="image/png"
            href="/favicon-16x16.png"
            sizes="16x16"
          />
          <link
            rel="icon"
            type="image/png"
            href="/favicon-128.png"
            sizes="128x128"
          />
          <meta name="application-name" content="&nbsp;" />
          <meta name="msapplication-TileColor" content="#FFFFFF" />
          <meta name="msapplication-TileImage" content="/mstile-144x144.png" />
          <meta
            name="msapplication-square70x70logo"
            content="/mstile-70x70.png"
          />
          <meta
            name="msapplication-square150x150logo"
            content="/mstile-150x150.png"
          />
          <meta
            name="msapplication-wide310x150logo"
            content="/mstile-310x150.png"
          />
          <meta
            name="msapplication-square310x310logo"
            content="/mstile-310x310.png"
          />
        </Head>
        <div
          className={cx(
            'flex items-center p-3 fixed z-40 top-1/2 left-1/2',
            '-translate-x-1/2 -translate-y-1/2',
            {
              'block pointer:hidden': true,
              hidden: !loading,
            },
          )}>
          <CircularProgress
            classes={{
              colorPrimary: 'text-black dark:text-white',
            }}
            size={24}
            thickness={5}
          />
        </div>
        {ads?.header?.enabled && (
          <div className="bg-gray-300 dark:bg-gray-800 overflow-hidden aspect-[2]">
            <div
              className="w-full h-full"
              dangerouslySetInnerHTML={{
                __html: ads.header.html,
              }}
            />
          </div>
        )}
        <div className="relative bg-white dark:bg-gray-950 min-h-screen">
          <NavCategory.Provider value={navCategory}>
            <Header preview={preview} fullWidth={isBrowsePath || isHomePath} />
            <Component {...pageProps} />
          </NavCategory.Provider>
        </div>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default MyApp;
