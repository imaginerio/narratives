import React from 'react';
import PropTypes from 'prop-types';
import { useQuery, gql } from '@apollo/client';
import { Container, Header as Heading, Image, Card, Popup, Icon } from 'semantic-ui-react';
import parse from 'html-react-parser';
import withApollo from '../providers/withApollo';

import Header from '../components/Header';

export const GET_PROJECTS = gql`
  query GetPublished {
    allProjects(where: { published: true }) {
      id
      title
      description
      category
      url
      tags {
        name
      }
      user {
        name
      }
    }
  }
`;

export const Home = ({ user }) => {
  const { loading, error, data } = useQuery(GET_PROJECTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div style={{ backgroundColor: '#FAFAFA', minHeight: '100vh' }}>
      <Header user={user} />
      <Container style={{ marginTop: 30, marginBottom: 30 }}>
        {user && (
          <a href="/projects" style={{ display: 'block', float: 'right' }}>
            <span>
              <Icon name="map outline" />
              Manage My Maps
            </span>
          </a>
        )}
        <Heading as="h1" style={{ margin: '50px 0' }}>
          Map Gallery
        </Heading>
        <Card.Group itemsPerRow={3}>
          {data.allProjects.map(proj => (
            <Card key={proj.id} href={`/view/${proj.id}`}>
              {proj.url && <Image src={proj.url} />}
              <Card.Content>
                <Card.Header>{proj.title}</Card.Header>
                <Card.Meta>{proj.category}</Card.Meta>
                <Card.Description>{proj.user.name}</Card.Description>
              </Card.Content>
              <Card.Content extra>
                <Popup
                  content={proj.description && parse(proj.description)}
                  // eslint-disable-next-line prettier/prettier, react/jsx-one-expression-per-line
                  trigger={<span><Icon name="info circle" />Map description</span>}
                />
              </Card.Content>
            </Card>
          ))}
        </Card.Group>
        <Image src="img/hrc-logo.png" style={{ margin: '50px 0' }} />
      </Container>
    </div>
  );
};

Home.propTypes = {
  user: PropTypes.string,
};

Home.defaultProps = {
  user: null,
};

export default withApollo(Home);

export async function getServerSideProps({ req }) {
  let user = null;
  if (req.user) user = req.user.id;
  return {
    props: {
      user,
    },
  };
}
