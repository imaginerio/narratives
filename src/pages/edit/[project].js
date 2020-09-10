import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Container, Grid } from 'semantic-ui-react';

import Header from '../../components/Header';
import Slides from '../../components/Slides';
import Editor from '../../components/Editor';

const GET_SLIDES = gql`
  query GetSlides($project: ID!) {
    Project(where: { id: $project }) {
      slides {
        id
        title
      }
    }
  }
`;

const ADD_SLIDE = gql`
  mutation AddSlide($project: ProjectRelateToOneInput) {
    createSlide(data: { project: $project }) {
      id
      title
    }
  }
`;

const EditPage = () => {
  const router = useRouter();
  const { project } = router.query;

  const [activeSlide, setActiveSlide] = useState(null);

  const { loading, error, data, refetch } = useQuery(GET_SLIDES, {
    variables: { project },
    onCompleted: res => setActiveSlide(res.Project.slides[0].id),
  });
  const [addSlide] = useMutation(ADD_SLIDE);

  if (loading || !project) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Container fluid>
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
                }).then(async ({ data: { createSlide } }) => {
                  await refetch({ variables: { project } });
                  setActiveSlide(createSlide.id);
                })
              }
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={2}>
            <Slides slides={data.Project.slides} active={activeSlide} handler={setActiveSlide} />
          </Grid.Column>
          <Grid.Column width={14}>
            <Editor slide={activeSlide} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default EditPage;
