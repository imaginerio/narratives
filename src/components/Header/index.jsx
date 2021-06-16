import React from 'react';
import PropTypes from 'prop-types';
import { useMutation, gql } from '@apollo/client';
import { Header as Heading } from 'semantic-ui-react';

import styles from './Header.module.css';

const UNAUTH_MUTATION = gql`
  mutation {
    unauthenticateUser {
      success
    }
  }
`;

const Header = ({ user }) => {
  const [signOut, { client }] = useMutation(UNAUTH_MUTATION, {
    onCompleted: async () => {
      // Ensure there's no old authenticated data hanging around
      await client.clearStore();
      window.location.replace('/');
    },
  });

  return (
    <div className={styles.header}>
      <Heading className={styles.title}>imagineRio Narratives</Heading>
      {user ? (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <a className={styles.logout} onClick={signOut} href="#">
          Logout
        </a>
      ) : (
        <a className={styles.logout} href="/projects">
          Login
        </a>
      )}
    </div>
  );
};

Header.propTypes = {
  user: PropTypes.string,
};

Header.defaultProps = {
  user: null,
};

export default Header;
