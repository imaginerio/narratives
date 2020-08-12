import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import LoginForm from '../components/LoginForm';

const Login = () => {
  const apolloClient = new ApolloClient({
    uri: 'http://localhost:3000/admin/api',
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={apolloClient}>
      <LoginForm />
    </ApolloProvider>
  );
};

export default Login;
