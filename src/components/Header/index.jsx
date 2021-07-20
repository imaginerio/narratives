import React from 'react';
import PropTypes from 'prop-types';
import { useMutation, gql } from '@apollo/client';
import Avatar from 'boring-avatars';
import { Image, Dropdown } from 'semantic-ui-react';

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
    <div style={{ backgroundColor: 'white' }}>
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
        <a href="/" className={`${styles.link} ${styles.active}`} style={{ marginRight: 20 }}>
          Narratives
        </a>
        {user && (
          <Dropdown
            icon={null}
            pointing
            style={{ marginTop: 5 }}
            trigger={
              // eslint-disable-next-line react/jsx-wrap-multilines
              <Avatar
                size={35}
                name="Ben Sheesley"
                variant="bauhaus"
                colors={['#3C558E', '#EAF0DB', '#6CB2F5', '#CDE1F5']}
              />
            }
          >
            <Dropdown.Menu style={{ marginLeft: -40 }}>
              <Dropdown.Item text="My narratives" as="a" href="/projects" />
              <Dropdown.Item text="Logout" onClick={signOut} />
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>
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
