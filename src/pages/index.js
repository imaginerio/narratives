import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import Projects from '../components/Projects';

const Home = () => {
  const client = new ApolloClient({
    uri: 'http://localhost:3000/admin/api',
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
