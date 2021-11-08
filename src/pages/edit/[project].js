import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation, gql } from '@apollo/client';
import axios from 'axios';
import ErrorPage from 'next/error';
import { Container, Grid, Dimmer, Loader } from 'semantic-ui-react';

import withApollo from '../../providers/withApollo';

import Head from '../../components/Head';
import Slides from '../../components/Slides';
import Editor from '../../components/Editor';
import EditorHeader from '../../components/Editor/EditorHeader';
import { DrawProvider } from '../../providers/DrawProvider';
import useProjectAuth from '../../providers/useProjectAuth';

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

const ADD_SLIDE = gql`
  mutation AddSlide($project: ProjectRelateToOneInput, $order: Int) {
    createSlide(data: { project: $project, order: $order }) {
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

const EditPage = ({ project, statusCode }) => {
  if (statusCode) return <ErrorPage statusCode={statusCode} />;

  const [activeSlide, setActiveSlide] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);

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

  const newSlide = slideId => {
    setApiLoading(true);
    let order;
    try {
      ({ order } = data.Project.slides.find(s => s.id === slideId));
    } catch {
      order = 1;
    }
    return addSlide({
      variables: {
        project: {
          connect: { id: project },
        },
        order,
      },
    }).then(async ({ data: { createSlide } }) => {
      await refetch();
      setActiveSlide(createSlide.id);
      setApiLoading(false);
    });
  };

  const duplicate = slideId => {
    setApiLoading(true);
    axios.get(`/duplicate/${slideId}`).then(async ({ data: { id } }) => {
      await refetch();
      setActiveSlide(id);
      setApiLoading(false);
    });
  };

  const removeSlide = id =>
    deleteSlide({
      variables: {
        id,
      },
    }).then(async () => {
      await refetch();
      setActiveSlide(data.Project.slides[0].id);
    });

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

  if (loading || !project)
    return (
      <Dimmer active>
        <Loader size="huge">Loading</Loader>
      </Dimmer>
    );
  if (error) return <p>Error :(</p>;

  return (
    <Container fluid>
      <Head title={`Editing ${data.Project.title}`} />
      <Grid>
        <Grid.Row style={{ paddingBottom: 0, zIndex: 2 }}>
          <Grid.Column>
            <EditorHeader title={data.Project.title} project={project} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row style={{ paddingTop: 0, paddingBottom: 0 }}>
          <Dimmer active={apiLoading}>
            <Loader size="huge">Loading</Loader>
          </Dimmer>
          <Grid.Column width={3}>
            <Slides
              slides={data.Project.slides}
              active={activeSlide}
              handler={setActiveSlide}
              onUpdate={updateSlideOrder}
              duplicate={duplicate}
              newSlide={newSlide}
              removeSlide={removeSlide}
            />
          </Grid.Column>
          <Grid.Column width={13} style={{ padding: 0 }}>
            <DrawProvider>{activeSlide && <Editor slide={activeSlide} />}</DrawProvider>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default withApollo(EditPage);

EditPage.propTypes = {
  project: PropTypes.string.isRequired,
  statusCode: PropTypes.number,
};

EditPage.defaultProps = {
  statusCode: null,
};

export async function getServerSideProps({ req, params: { project } }) {
  const statusCode = await useProjectAuth({ req, project });
  return { props: { project, statusCode } };
}
