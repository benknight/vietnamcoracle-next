// import App from 'next/app'
import { create } from 'jss';
import React from 'react';
import { StylesProvider, jssPreset } from '@material-ui/core/styles';
import Header from '../components/Header';
import '../style.css';

function MyApp({ Component, pageProps }) {
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
      <Header />
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
