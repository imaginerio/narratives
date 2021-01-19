import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation, gql } from '@apollo/client';
import { getDataFromTree } from '@apollo/react-ssr';
import { Container, Grid } from 'semantic-ui-react';
import withApollo from '../../lib/withApollo';

import Slides from '../../components/Slides';
import Editor from '../../components/Editor';
import EditorHeader from '../../components/Editor/EditorHeader';

const GET_SLIDES = gql`
  query GetSlides($project: ID!) {
    Project(where: { id: $project }) {
      title
      slides(sortBy: order_ASC) {
        id
        title
        order
      }
    }
  }
`;

const GET_META = gql`
  query {
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

const DELETE_SLIDE = gql`
  mutation deleteSlide($id: ID!) {
    deleteSlide(id: $id) {
      id
    }
  }
`;

const EDIT_SLIDE_ORDER = gql`
  mutation setOrder($data: [SlidesUpdateInput]) {
    updateSlides(data: $data) {
      id
      title
      order
    }
  }
`;

const EditPage = () => {
  const router = useRouter();
  const { project } = router.query;

  const [activeSlide, setActiveSlide] = useState(null);

  const [addSlide] = useMutation(ADD_SLIDE);
  const [deleteSlide] = useMutation(DELETE_SLIDE);
  const [editSlideOrder] = useMutation(EDIT_SLIDE_ORDER);

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
  const meta = useQuery(GET_META);

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

  const removeSlide = id =>
    deleteSlide({
      variables: {
        id,
      },
      refetchQueries: [{ query: GET_SLIDES, variables: { project } }],
    }).then(() => setActiveSlide(data.Project.slides[0].id));

  const updateSlideOrder = newData =>
    editSlideOrder({
      variables: {
        data: newData,
      },
      optimisticResponse: {
        __typename: 'Mutation',
        updateSlides: newData.map(d => ({
          __typename: 'Slide',
          id: d.id,
          title: d.data.title,
          order: d.data.order,
        })),
      },
      refetchQueries: [{ query: GET_SLIDES, variables: { project } }],
    });

  if (loading || !project || meta.loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Container fluid>
      <Grid>
        <Grid.Row style={{ paddingBottom: 0, zIndex: 2 }}>
          <Grid.Column>
            <EditorHeader title={data.Project.title} handler={newSlide} project={project} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row style={{ paddingTop: 0, paddingBottom: 0 }}>
          <Grid.Column width={3}>
            <Slides
              slides={data.Project.slides}
              active={activeSlide}
              handler={setActiveSlide}
              onUpdate={updateSlideOrder}
            />
          </Grid.Column>
          <Grid.Column width={13} style={{ padding: 0 }}>
            {activeSlide && (
              <Editor
                slide={activeSlide}
                layers={meta.data.allLayers}
                basemaps={meta.data.allBasemaps}
                removeSlide={removeSlide}
              />
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default withApollo(EditPage, { getDataFromTree });
