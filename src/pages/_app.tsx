import type { AppProps } from 'next/app';
import Link from 'next/link';
import { create } from 'jss';
import { StylesProvider, jssPreset } from '@material-ui/core/styles';
import Header from '../components/Header';
import Nav from '../components/Nav';
import '../style.css';

function MyApp({ Component, pageProps }: AppProps) {
  const jss = create({
    ...jssPreset(),
    // Define a custom insertion point that JSS will look for when injecting the styles into the DOM.
    insertionPoint:
      typeof window !== 'undefined'
        ? window.document.getElementById('jss-insertion-point')
        : undefined,
  });
  return (
    <StylesProvider jss={jss}>
      {pageProps.preview && (
        <div className="z-50 fixed flex items-center justify-center h-8 top-0 left-0 w-full bg-blue-400 dark:bg-blue-900 text-white shadow">
          <Link href="/api/exit-preview">
            <a className="text-xs hover:underline">
              Preview mode enabled. Click here to exit.
            </a>
          </Link>
        </div>
      )}
      <Header preview={pageProps.preview} />
      <Nav preview={pageProps.preview} />
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
