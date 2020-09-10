import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Container, Form, Button } from 'semantic-ui-react';

const Login = () => {
  const AUTH_MUTATION = gql`
    mutation signin($identity: String, $secret: String) {
      authenticate: authenticateUserWithPassword(email: $identity, password: $secret) {
        item {
          id
        }
      }
    }
  `;

  const [identity, setIdentity] = useState('');
  const [secret, setSecret] = useState('');
  const [reloading, setReloading] = useState(false);

  const [signIn, { error, loading, client }] = useMutation(AUTH_MUTATION, {
    variables: { identity, secret },
    onCompleted: async () => {
      // Flag so the "Submit" button doesn't temporarily flash as available while reloading the page.
      setReloading(true);

      // Ensure there's no old unauthenticated data hanging around
      await client.clearStore();

      // Let the server-side redirects kick in to send the user to the right place
      window.location.reload(true);
    },
    onError: () => {}, // Remove once a bad password no longer throws an error
  });

  const onSubmit = e => {
    e.preventDefault();
    if (!loading) {
      signIn();
    }
  };

  return (
    <Container>
      <Form method="POST" onSubmit={onSubmit}>
        <Form.Input
          name="email"
          label="Email"
          type="email"
          value={identity}
          onChange={e => setIdentity(e.target.value)}
        />
        <Form.Input
          name="password"
          label="Password"
          type="password"
          value={secret}
          onChange={e => setSecret(e.target.value)}
        />
        <Button type="submit">Submit</Button>
      </Form>
    </Container>
  );
};

export default Login;
