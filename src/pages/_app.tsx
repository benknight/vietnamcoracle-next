import cx from 'classnames';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import smoothscroll from 'smoothscroll-polyfill';
import CircularProgress from '@material-ui/core/CircularProgress';
import { StylesProvider } from '@material-ui/core/styles';
import Header from '../components/Header';
import NavBar from '../components/NavBar';
import '../config/custom-elements';
import { pageview } from '../lib/GoogleAnalytics';
import useWaitCursor from '../lib/useWaitCursor';
import '../styles/fonts.css';
import '../styles/style.css';

if (typeof window !== 'undefined') {
  smoothscroll.polyfill();
}

const PreviewAlert = dynamic(() => import('../components/PreviewAlert'));

function MyApp({ Component, pageProps }: AppProps) {
  const { preview } = pageProps;
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
    //When the component is mounted, subscribe to router changes
    //and log those page views
    router.events.on('routeChangeComplete', handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  useWaitCursor(loading);

  return (
    <StylesProvider>
      <Head>
        <title>Vietnam Coracle</title>
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
      {preview && <PreviewAlert />}
      <Header preview={preview} />
      <NavBar navCategory={pageProps?.navCategory} preview={preview} />
      <Component {...pageProps} />
    </StylesProvider>
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
