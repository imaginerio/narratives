import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import axios from 'axios';
import {
  Container,
  Header as Heading,
  Image,
  Segment,
  Form,
  Button,
  Message,
} from 'semantic-ui-react';

import withApollo from '../../../providers/withApollo';
import Header from '../../../components/Header';
import Head from '../../../components/Head';

const Reset = ({ verified }) => {
  const {
    query: { key },
  } = useRouter();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState(verified ? '' : 'Your link is invalid or has expired');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = e => {
    e.preventDefault();
    if (password && password === confirm) {
      setLoading(true);
      return axios.post('/password', { key, password }).then(() => {
        setLoading(false);
        setSuccess(true);
      });
    }
    return setError('Please fill out all required fields');
  };

  return (
    <div style={{ backgroundColor: '#FAFAFA', minHeight: '100vh' }}>
      <Head title="Reset your password" />
      <Header />
      <Container text>
        <Heading as="h1" style={{ margin: '50px 0' }}>
          Reset your imagineRio Narratives Password
        </Heading>
        <Segment loading={loading}>
          <Heading as="h3" style={{ margin: '10px 0 30px' }}>
            Enter your new password below:
          </Heading>
          <Form method="POST" onSubmit={onSubmit}>
            <Form.Group widths="equal">
              <Form.Input
                required
                name="password"
                label="Password"
                type="password"
                value={password}
                disabled={!verified}
                error={error && verified && !password ? 'Password is required' : null}
                onChange={e => setPassword(e.target.value)}
              />
              <Form.Input
                required
                name="confirm"
                label="Confirm Password"
                type="password"
                value={confirm}
                disabled={!verified}
                error={error && password !== confirm ? 'Passwords do not match' : null}
                onChange={e => setConfirm(e.target.value)}
              />
            </Form.Group>
            <Button type="submit" fluid primary loading={loading}>
              Reset Password
            </Button>
            {error && <Message negative>{error}</Message>}
            {success && (
              <Message success>
                Your password has been reset. You can now <a href="/login">login</a> with your new
                password.
              </Message>
            )}
          </Form>
        </Segment>
        <Image src="/img/hrc-logo.png" />
      </Container>
    </div>
  );
};

Reset.propTypes = {
  verified: PropTypes.bool.isRequired,
};

export default withApollo(Reset);

export async function getServerSideProps({ params, req }) {
  const {
    data: { data },
  } = await axios.post(`${req.protocol}://${req.get('Host')}/admin/api`, {
    query: `query GetReset($key: String){
      allUsers(where: { resetId: $key }){
        id
      }
    }`,
    variables: {
      key: params.key,
    },
  });

  if (data.allUsers.length) {
    return { props: { verified: true } };
  }

  return { props: { verified: false } };
}
