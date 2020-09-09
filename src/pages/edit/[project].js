import React from 'react';
import { useRouter } from 'next/router';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { Container } from 'semantic-ui-react';

import Editor from '../../components/Editor';

const EditPage = () => {
  const client = new ApolloClient({
    uri: 'http://localhost:3000/admin/api',
    cache: new InMemoryCache(),
  });

  const router = useRouter();
  const { project } = router.query;

  return (
    <ApolloProvider client={client}>
      <Container>
        <h1>NextJS GraphQL Apollo App</h1>
        <Editor project={project} />
      </Container>
    </ApolloProvider>
  );
};

export default EditPage;
