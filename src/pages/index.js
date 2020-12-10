import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Container, Header, Image, Card, Popup, Icon } from 'semantic-ui-react';
import withApollo from '../lib/withApollo';

const GET_PROJECTS = gql`
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

const Projects = () => {
  const { loading, error, data } = useQuery(GET_PROJECTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <>
      <div style={{ height: 60, lineHeight: '60px', padding: '0 20px', marginTop: -20 }}>
        <a href="/projects" style={{ display: 'block', float: 'right' }}>
          Login
        </a>
        <h4 style={{ lineHeight: '60px' }}>Rio Story Maps</h4>
      </div>
      <Container text style={{ marginTop: 30, marginBottom: 30 }}>
        <Header as="h1">Map Gallery</Header>
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
                <Popup content={proj.description} trigger={<Icon name="info circle" />} />
                Map description
              </Card.Content>
            </Card>
          ))}
        </Card.Group>
        <Image src="img/hrc-logo.png" />
      </Container>
    </>
  );
};

export default withApollo(Projects);
