import cx from 'classnames';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { create } from 'jss';
import { useEffect, useMemo, useState } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import { StylesProvider, jssPreset } from '@material-ui/core/styles';
import Header from '../components/Header';
import Nav from '../components/Nav';
import useWaitCursor from '../lib/useWaitCursor';
import '../styles/style.css';

const PreviewAlert = dynamic(() => import('../components/PreviewAlert'));

function MyApp({ Component, pageProps }: AppProps) {
  const { preview } = pageProps;
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const jss = useMemo(
    () =>
      create({
        ...jssPreset(),
        // Define a custom insertion point that JSS will look for when injecting the styles into the DOM.
        insertionPoint:
          typeof window !== 'undefined'
            ? window.document.getElementById('jss-insertion-point')
            : undefined,
      }),
    [],
  );

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
    <StylesProvider jss={jss}>
      <LinearProgress
        classes={{
          root: cx('absolute z-40 top-0 w-full h-0.5 bg-transparent', {
            'block lg:hidden': loading,
            hidden: !loading,
          }),
          bar: 'bg-gray-700 dark:bg-white',
        }}
      />
      {preview && <PreviewAlert />}
      <Header preview={preview} />
      <Nav preview={preview} />
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
