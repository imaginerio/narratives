import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import {
  Header as Heading,
  Container,
  Segment,
  Form,
  Button,
  Image,
  Message,
} from 'semantic-ui-react';

import Header from '../components/Header';
import Head from '../components/Head';

const Reset = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const onSubmit = e => {
    e.preventDefault();
    if (email) {
      // send API request to reset password
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
              name="email"
              label="Email"
              type="email"
              value={email}
              error={error && !email ? 'Email is required' : null}
              onChange={e => setEmail(e.target.value)}
            />
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

Reset.propTypes = {};

Reset.defaultProps = {};

export default Reset;
