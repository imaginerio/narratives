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
import useLocale from '../hooks/useLocale';

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
  const {
    createAccount,
    enterDetails,
    name,
    email,
    password,
    institution,
    confirm,
    createButton,
    createSuccess,
    createError,
    fieldError,
  } = useLocale();
  const [data, setData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [signUp, { loading }] = useMutation(ADD_USER, {
    variables: { ...data },
    onCompleted: () => {
      setSuccess(createSuccess);
    },
    onError: () => {
      setError(createError);
    },
  });

  const onSubmit = e => {
    e.preventDefault();
    if (data.name && data.email && data.password && data.password === data.confirm) {
      signUp();
    } else {
      setError(fieldError);
    }
  };

  return (
    <div style={{ backgroundColor: '#FAFAFA', minHeight: '100vh' }}>
      <Head title="Signup" />
      <Header />
      <Container text>
        <Heading as="h1" style={{ margin: '50px 0' }}>
          {createAccount}
        </Heading>
        {success && (
          <Message success onDismiss={() => window.location.replace('/')}>
            {success}
          </Message>
        )}
        <Segment loading={loading} disabled={success}>
          <Heading as="h3" style={{ margin: '10px 0 30px' }}>
            {enterDetails}
          </Heading>
          <Form method="POST" onSubmit={onSubmit}>
            <Form.Input
              required
              name="name"
              label={name}
              type="text"
              value={data.text}
              error={error && !data.name ? 'Name is required' : null}
              onChange={e => setData({ ...data, name: e.target.value })}
            />
            <Form.Input
              required
              name="email"
              label={email}
              type="email"
              value={data.email}
              error={error && !data.email ? 'Email is required' : null}
              onChange={e => setData({ ...data, email: e.target.value })}
            />
            <Form.Input
              name="institution"
              label={institution}
              type="text"
              value={data.institution}
              onChange={e => setData({ ...data, institution: e.target.value })}
            />
            <Form.Group widths="equal">
              <Form.Input
                required
                name="password"
                label={password}
                type="password"
                value={data.password}
                error={error && !data.password ? 'Password is required' : null}
                onChange={e => setData({ ...data, password: e.target.value })}
              />
              <Form.Input
                required
                name="confirm"
                label={confirm}
                type="password"
                value={data.confirm}
                error={error && data.password !== data.confirm ? 'Passwords do not match' : null}
                onChange={e => setData({ ...data, confirm: e.target.value })}
              />
            </Form.Group>
            <Button type="submit" fluid primary loading={loading}>
              {createButton}
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
