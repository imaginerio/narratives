import React from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Container, Grid } from 'semantic-ui-react';

import Header from '../../components/Header';
import Slides from '../../components/Slides';

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

const EditPage = () => {
  const router = useRouter();
  const { project } = router.query;

  const { loading, error, data } = useQuery(GET_SLIDES, { variables: { project } });
  const [addSlide] = useMutation(ADD_SLIDE);

  if (loading || !project) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Container>
      <h1>NextJS GraphQL Apollo App</h1>
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
    </Container>
  );
};

export default EditPage;
