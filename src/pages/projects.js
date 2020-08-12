import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import Projects from '../components/Projects';

const Home = () => {
  const client = new ApolloClient({
    uri: 'http://localhost:3000/admin/api',
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <div>
        <h1>NextJS GraphQL Apollo App</h1>
        <Projects />
      </div>
    </ApolloProvider>
  );
};

export default Home;
