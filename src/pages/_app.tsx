import cx from 'classnames';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { create } from 'jss';
import { useEffect, useMemo, useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { StylesProvider, jssPreset } from '@material-ui/core/styles';
import Header from '../components/Header';
import NavBar from '../components/NavBar';
import useWaitCursor from '../lib/useWaitCursor';
import '../config/custom-elements';
import '../styles/style.css';

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

  useWaitCursor(loading);

  return (
    <StylesProvider>
      <div
        className={cx(
          'fixed z-40 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center p-3 bg-white dark:bg-gray-700 shadow rounded-full',
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
      <NavBar preview={preview} />
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
