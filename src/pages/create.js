import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { Container, Header } from 'semantic-ui-react';

import CreateForm from '../components/CreateForm';

const Create = () => {
  const client = new ApolloClient({
    uri: 'http://localhost:3000/admin/api',
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <Container>
        <Header as="h1">Add Map</Header>
        <CreateForm />
      </Container>
    </ApolloProvider>
  );
};

export default Create;
