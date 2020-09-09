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

const ADD_SLIDE = gql`
  mutation AddSlide($project: ProjectRelateToOneInput) {
    createSlide(data: { project: $project }) {
      id
    }
  }
`;

const Editor = ({ project }) => {
  const { loading, error, data } = useQuery(GET_SLIDES, { variables: { project } });
  const [addSlide] = useMutation(ADD_SLIDE);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column>
          <Header
            handler={() =>
              addSlide({
                variables: {
                  project: {
                    connect: { id: '5f591e863413500f86e010de' },
                  },
                },
                refetchQueries: ['GetSlides'],
                awaitRefetchQueries: true,
              })
            }
          />
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
