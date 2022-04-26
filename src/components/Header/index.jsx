import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useMutation, gql } from '@apollo/client';
import Avatar from 'boring-avatars';
import { Container, Image, Dropdown } from 'semantic-ui-react';

import styles from './Header.module.css';

const UNAUTH_MUTATION = gql`
  mutation {
    unauthenticateUser {
      success
    }
  }
`;

const pages = [
  {
    name: 'Home',
    url: '/',
    active: false,
    relative: false,
  },
  {
    name: 'About',
    url: '/about',
    active: false,
    relative: false,
  },
  {
    name: 'People',
    url: '/people',
    active: false,
    relative: false,
  },
  {
    name: 'Research',
    url: '/research',
    active: false,
    relative: false,
  },
  {
    name: 'Press',
    url: '/press',
    active: false,
    relative: false,
  },
  {
    name: 'Narratives',
    url: '/',
    active: true,
    relative: true,
  },
  {
    name: 'Iconography',
    url: '/iconography',
    active: false,
    relative: false,
  },
  {
    name: 'Map',
    url: '/map',
    active: false,
    relative: false,
  },
];

const Header = ({ user }) => {
  const { locale } = useRouter();
  const [signOut, { client }] = useMutation(UNAUTH_MUTATION, {
    onCompleted: async () => {
      // Ensure there's no old authenticated data hanging around
      await client.clearStore();
      window.location.replace('/');
    },
  });

  return (
    <div style={{ backgroundColor: 'white' }}>
      <Container>
        <div className={`${styles.header} ${styles.headerFlex}`}>
          <Image src="/img/rio-logo.svg" style={{ width: 150 }} />
          <div className={styles.spacer} />
          <div className={styles.headerFlex}>
            {pages.map(({ name, url, active, relative }) => (
              <a
                key={name}
                className={`${styles.link} ${active ? styles.active : ''}`}
                href={`${relative ? `/${locale}` : process.env.NEXT_PUBLIC_MAIN_SITE}${url}`}
              >
                {name}
              </a>
            ))}
            {user && user.verified && (
              <Dropdown
                icon={null}
                pointing
                style={{ marginTop: 5, marginLeft: 15 }}
                trigger={
                  // eslint-disable-next-line react/jsx-wrap-multilines
                  <Avatar
                    size={35}
                    name={user.name}
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
      </Container>
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
