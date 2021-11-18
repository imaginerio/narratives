import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Container, Header as Heading, Image, Segment } from 'semantic-ui-react';

import withApollo from '../../../providers/withApollo';
import Header from '../../../components/Header';

const Verify = ({ verified }) => (
  <div style={{ backgroundColor: '#FAFAFA', minHeight: '100vh' }}>
    <Header />
    <Container>
      <Heading as="h1" style={{ margin: '50px 0' }}>
        imagineRio Narratives
      </Heading>
      <Segment style={{ padding: '20px 80px 40px' }}>
        <Heading as="h3" style={{ margin: '10px 0 30px' }}>
          {`${
            verified
              ? 'Your account has been successfully verified'
              : 'Your account could not be verified'
          }`}
        </Heading>
        {verified ? (
          <p>
            You may now <a href="/projects">login</a>
          </p>
        ) : (
          <p>Your account is already activated or your verification link could not be found.</p>
        )}
      </Segment>
      <Image src="/img/hrc-logo.png" />
    </Container>
  </div>
);

Verify.propTypes = {
  verified: PropTypes.bool.isRequired,
};

export default withApollo(Verify);

export async function getServerSideProps({ params, req }) {
  const {
    data: { data },
  } = await axios.post(`${req.protocol}://${req.get('Host')}/admin/api`, {
    query: `query GetVerification($key: String){
      allUsers(where: { verifyId: $key, verified_not: true }){
        id
      }
    }`,
    variables: {
      key: params.key,
    },
  });

  if (data.allUsers.length) {
    await axios.post(`${req.protocol}://${req.get('Host')}/admin/api`, {
      query: `mutation VerifyUser($id: ID!){
        updateUser(id: $id, data: { verified: true }){
          id
        }
      }`,
      variables: {
        id: data.allUsers[0].id,
      },
    });
    return { props: { verified: true } };
  }

  return { props: { verified: false } };
}
