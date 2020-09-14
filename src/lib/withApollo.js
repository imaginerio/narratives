/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React from 'react';
import withApollo from 'next-with-apollo';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

export default withApollo(
  ({ initialState, headers }) => {
    return new ApolloClient({
      uri: 'http://localhost:3000/admin/api',
      cache: new InMemoryCache().restore(initialState || {}),
      request: operation => {
        operation.setContext({
          fetchOptions: {
            credentials: 'include',
          },
          headers: { cookie: headers && headers.cookie },
        });
      },
    });
  },
  {
    render: ({ Page, props }) => {
      return (
        <ApolloProvider client={props.apollo}>
          <Page {...props} />
        </ApolloProvider>
      );
    },
  }
);
