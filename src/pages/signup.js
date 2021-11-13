import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import {
  Header as Heading,
  Container,
  Segment,
  Form,
  Button,
  Image,
  Message,
} from 'semantic-ui-react';
import withApollo from '../providers/withApollo';

import Header from '../components/Header';
import Head from '../components/Head';

const ADD_USER = gql`
  mutation AddUser($name: String, $email: String, $password: String, $institution: String) {
    createUser(
      data: { name: $name, email: $email, password: $password, institution: $institution }
    ) {
      id
    }
  }
`;

const Signup = () => {
  const [data, setData] = useState({});
  const [error, setError] = useState('');

  const [signUp, { loading, client }] = useMutation(ADD_USER, {
    variables: { ...data },
    onCompleted: async () => {
      await client.clearStore();
      window.location.reload(true);
    },
    onError: () => {
      setError('Could not create your account. Please try again.');
    },
  });

  const onSubmit = e => {
    e.preventDefault();
    if (data.name && data.email && data.password && data.password === data.confirm) {
      signUp();
    } else {
      setError('Please fill out all required fields');
    }
  };

  return (
    <div style={{ backgroundColor: '#FAFAFA', minHeight: '100vh' }}>
      <Head title="Signup" />
      <Header />
      <Container text>
        <Heading as="h1" style={{ margin: '50px 0' }}>
          Create your account for imagineRio Narratives
        </Heading>
        <Segment loading={loading}>
          <Heading as="h3" style={{ margin: '10px 0 30px' }}>
            Enter your details below:
          </Heading>
          <Form method="POST" onSubmit={onSubmit}>
            <Form.Input
              required
              name="name"
              label="Full Name"
              type="text"
              value={data.text}
              error={error && !data.name ? 'Name is required' : null}
              onChange={e => setData({ ...data, name: e.target.value })}
            />
            <Form.Input
              required
              name="email"
              label="Email"
              type="email"
              value={data.email}
              error={error && !data.email ? 'Email is required' : null}
              onChange={e => setData({ ...data, email: e.target.value })}
            />
            <Form.Input
              name="institution"
              label="Institution"
              type="text"
              value={data.institution}
              onChange={e => setData({ ...data, institution: e.target.value })}
            />
            <Form.Group widths="equal">
              <Form.Input
                required
                name="password"
                label="Password"
                type="password"
                value={data.password}
                error={error && !data.password ? 'Password is required' : null}
                onChange={e => setData({ ...data, password: e.target.value })}
              />
              <Form.Input
                required
                name="confirm"
                label="Confirm Password"
                type="password"
                value={data.confirm}
                error={error && data.password !== data.confirm ? 'Passwords do not match' : null}
                onChange={e => setData({ ...data, confirm: e.target.value })}
              />
            </Form.Group>
            <Button type="submit" fluid primary loading={loading}>
              Create Account
            </Button>
            {error && <Message negative>{error}</Message>}
          </Form>
        </Segment>
        <Image src="img/hrc-logo.png" />
      </Container>
    </div>
  );
};

export default withApollo(Signup);
