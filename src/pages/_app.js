/* eslint-disable react/prop-types */
import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import 'semantic-ui-css/semantic.min.css';
import 'mapbox-gl/dist/mapbox-gl.css';

// import App from 'next/app'

function MyApp({ Component, pageProps }) {
  const client = new ApolloClient({
    uri: 'http://localhost:3000/admin/api',
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
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
