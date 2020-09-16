import React from 'react';
import PropTypes from 'prop-types';
import { useQuery, gql } from '@apollo/client';
import { Container, Header, Segment, Button, Image } from 'semantic-ui-react';
import withApollo from '../lib/withApollo';

const GET_PROJECTS = gql`
  query GetProjects($user: ID!) {
    allProjects(where: { user: { id: $user } }) {
      id
      title
      description
      category
      url
      tags {
        name
      }
    }
  }
`;

const Projects = ({ user }) => {
  const { loading, error, data } = useQuery(GET_PROJECTS, { variables: { user } });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Container text style={{ marginTop: 30, marginBottom: 30 }}>
      <Header as="h1">Manage Story Maps</Header>
      <Button content="Add Map" icon="plus" size="large" color="blue" as="a" href="/create" />
      <Segment.Group>
        {data.allProjects.map(proj => (
          <Segment key={proj.id}>
            {proj.url && <Image src={proj.url} floated="left" style={{ height: 60 }} />}
            <span style={{ fontWeight: 'bold', fontSize: '1.25em' }}>
              {`${proj.title} - ${proj.category}`}
            </span>
            <Button floated="right" content="Editor" icon="edit" as="a" href={`/edit/${proj.id}`} />
            <div style={{ clear: 'right' }}>Created / Modified / Published</div>
          </Segment>
        ))}
      </Segment.Group>
    </Container>
  );
};

Projects.propTypes = {
  user: PropTypes.string.isRequired,
};

export default withApollo(Projects);

export async function getServerSideProps({ req }) {
  return {
    props: {
      user: req.user.id,
    },
  };
}
