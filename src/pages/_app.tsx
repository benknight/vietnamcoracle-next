import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { create } from 'jss';
import { useEffect, useMemo } from 'react';
import { StylesProvider, jssPreset } from '@material-ui/core/styles';
import Header from '../components/Header';
import Nav from '../components/Nav';
import '../style.css';

const PreviewAlert = dynamic(() => import('../components/PreviewAlert'));

function MyApp({ Component, pageProps }: AppProps) {
  const { preview } = pageProps;
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
    const handleRouteChange = (url, { shallow }) => {
      const header = document.querySelector('header');
      const { height: headerHeight } = header.getBoundingClientRect();
      window.requestAnimationFrame(() => {
        if (window.scrollY < headerHeight) {
          window.scrollTo(0, headerHeight);
        }
      });
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);

  return (
    <StylesProvider jss={jss}>
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
