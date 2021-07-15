import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Container, Header as Heading, Segment, Button, Image, Icon } from 'semantic-ui-react';
import withApollo from '../providers/withApollo';

import Header from '../components/Header';

const GET_PROJECTS = gql`
  query GetProjects($user: ID!) {
    allProjects(where: { user: { id: $user } }) {
      id
      title
      description
      category
      url
      createdAt
      updatedAt
      published
      tags {
        name
      }
    }
  }
`;

const CREATE_PROJECT = gql`
  mutation AddProject(
    $title: String
    $description: String
    $imageTitle: String
    $source: String
    $url: String
    $tags: TagRelateToManyInput
    $category: ProjectCategoryType
  ) {
    createProject(
      data: {
        title: $title
        description: $description
        tags: $tags
        category: $category
        imageTitle: $imageTitle
        source: $source
        url: $url
      }
    ) {
      id
    }
  }
`;

const Projects = ({ user }) => {
  const [isLoading, setLoading] = useState(false);
  const { loading, error, data } = useQuery(GET_PROJECTS, { variables: { user } });
  const [createProject] = useMutation(CREATE_PROJECT);

  const newProject = () => {
    setLoading(true);
    createProject({
      variables: {
        title: 'Untitled project',
      },
    }).then(
      ({
        data: {
          createProject: { id },
        },
      }) => window.location.replace(`/project/${id}`)
    );
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div style={{ backgroundColor: '#FAFAFA', minHeight: '100vh' }}>
      <Header user={user} />
      <Container style={{ marginTop: 30, marginBottom: 30 }}>
        <a href="/" style={{ display: 'block', float: 'right', lineHeight: '36px' }}>
          <span>
            <Icon name="grid layout" />
            Map Gallery
          </span>
        </a>
        <Heading as="h1" style={{ marginTop: 30 }}>
          My Narratives / Minhas narrativas
        </Heading>
        <Button
          content="Add Narrative / Nova narrativa"
          loading={isLoading}
          icon="plus"
          size="large"
          color="blue"
          as="a"
          onClick={newProject}
          style={{ margin: '10px 0 20px' }}
        />
        <Segment.Group>
          {data.allProjects.map(proj => (
            <Segment key={proj.id} style={{ padding: 20 }}>
              {proj.url && <Image src={proj.url} floated="left" style={{ height: 55 }} />}
              <a href={`/project/${proj.id}`} style={{ fontWeight: 'bold', fontSize: '1.25em' }}>
                {`${proj.title}${proj.category ? ` - ${proj.category}` : ''}`}
              </a>
              <Button
                floated="right"
                content="Editor"
                icon="edit"
                as="a"
                href={`/edit/${proj.id}`}
              />
              <Button
                basic
                floated="right"
                content="Preview"
                icon="play"
                as="a"
                style={{ marginRight: 10 }}
                href={`/view/${proj.id}`}
              />
              <div style={{ clear: 'right' }}>
                {proj.updatedAt && (
                  <span style={{ marginRight: 10 }}>
                    {`Modified: ${new Date(proj.updatedAt).toLocaleDateString()}`}
                  </span>
                )}
                {proj.createdAt && (
                  <span style={{ marginRight: 10 }}>
                    {`Created: ${new Date(proj.createdAt).toLocaleDateString()}`}
                  </span>
                )}
                {proj.published && (
                  <span>
                    <Icon name="check" />
                    Published
                  </span>
                )}
              </div>
            </Segment>
          ))}
        </Segment.Group>
        <Button icon labelPosition="left" floated="right" size="tiny" as="a" href="/download">
          <Icon name="download" />
          Download my data
        </Button>
        <Image src="img/hrc-logo.png" />
      </Container>
    </div>
  );
};

Projects.propTypes = {
  user: PropTypes.string.isRequired,
};

export default withApollo(Projects);

export async function getServerSideProps({ res, req }) {
  if (!req.user.termsAccepted) {
    res.setHeader('location', '/legal/terms');
    res.statusCode = 302;
    res.end();
  }
  if (!req.user.privacyAccepted) {
    res.setHeader('location', '/legal/privacy');
    res.statusCode = 302;
    res.end();
  }
  return {
    props: {
      user: req.user.id,
    },
  };
}
