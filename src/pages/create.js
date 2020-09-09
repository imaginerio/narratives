import React from 'react';
import { Container, Header } from 'semantic-ui-react';

import CreateForm from '../components/CreateForm';

const Create = () => (
  <Container>
    <Header as="h1">Add Map</Header>
    <CreateForm />
  </Container>
);

export default Create;
