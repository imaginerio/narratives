import React from 'react';
import PropTypes from 'prop-types';
import { useMutation, gql } from '@apollo/client';
import { Image } from 'semantic-ui-react';

import styles from './Header.module.css';

const UNAUTH_MUTATION = gql`
  mutation {
    unauthenticateUser {
      success
    }
  }
`;

const pages = {
  Home: '/',
  About: '/about',
  People: '/people',
  Research: '/research',
  Press: '/press',
  Iconography: '/iconography',
  Map: '/map',
};

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
      <Image src="/img/rio-logo.svg" style={{ width: 150 }} />
      <div className={styles.spacer} />
      {Object.keys(pages).map(page => (
        <a
          key={page}
          className={styles.link}
          href={`${process.env.NEXT_PUBLIC_MAIN_SITE}${pages[page]}`}
        >
          {page}
        </a>
      ))}
      <a href="/" className={`${styles.link} ${styles.active}`}>
        Narratives
      </a>
      {user ? (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <a className={styles.link} onClick={signOut} href="#">
          Logout
        </a>
      ) : (
        <a className={styles.link} href="/projects">
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
