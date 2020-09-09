import React from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Grid } from 'semantic-ui-react';

import Header from '../Header';
import Slides from '../Slides';

const GET_SLIDES = gql`
  query GetSlides($project: ID!) {
    Project(where: { id: $project }) {
      slides {
        id
        title
        description
        year
        longitude
        latitude
        zoom
        bearing
        pitch
      }
    }
  }
`;

const Editor = ({ project }) => {
  const { loading, error, data } = useQuery(GET_SLIDES, { variables: { project } });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column>
          <Header />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={2}>
          <Slides slides={data.Project.slides} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

Editor.propTypes = {
  project: PropTypes.string.isRequired,
};

export default Editor;
