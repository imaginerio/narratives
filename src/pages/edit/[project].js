import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation, gql } from '@apollo/client';
import { getDataFromTree } from '@apollo/react-ssr';
import { Container, Grid } from 'semantic-ui-react';
import withApollo from '../../lib/withApollo';

import Header from '../../components/Header';
import Slides from '../../components/Slides';
import Editor from '../../components/Editor';

const GET_SLIDES = gql`
  query GetSlides($project: ID!) {
    Project(where: { id: $project }) {
      title
      slides(sortBy: order_ASC) {
        id
        title
      }
    }
    allLayers {
      id
      layerId
      title
      remoteId
    }
    allBasemaps {
      id
      ssid
      title
      firstYear
      lastYear
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

  const [addSlide] = useMutation(ADD_SLIDE);

  const { loading, error, data, refetch } = useQuery(GET_SLIDES, {
    variables: { project },
    onCompleted: res => {
      if (res.Project.slides.length) {
        setActiveSlide(res.Project.slides[0].id);
      } else {
        // eslint-disable-next-line no-use-before-define
        newSlide();
      }
    },
  });

  const newSlide = () =>
    addSlide({
      variables: {
        project: {
          connect: { id: project },
        },
      },
    }).then(async ({ data: { createSlide } }) => {
      await refetch({ variables: { project } });
      setActiveSlide(createSlide.id);
    });

  if (loading || !project) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Container fluid>
      <Grid>
        <Grid.Row style={{ paddingBottom: 0, zIndex: 2 }}>
          <Grid.Column>
            <Header title={data.Project.title} handler={newSlide} project={project} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row style={{ paddingTop: 0, paddingBottom: 0 }}>
          <Grid.Column width={3}>
            <Slides slides={data.Project.slides} active={activeSlide} handler={setActiveSlide} />
          </Grid.Column>
          <Grid.Column width={13} style={{ padding: 0 }}>
            {activeSlide && (
              <Editor slide={activeSlide} layers={data.allLayers} basemaps={data.allBasemaps} />
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default withApollo(EditPage, { getDataFromTree });
