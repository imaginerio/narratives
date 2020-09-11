import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation, gql } from '@apollo/client';
import { pick } from 'lodash';
import { Grid, Form, Input } from 'semantic-ui-react';

import Atlas from '../Atlas';

const GET_SLIDES = gql`
  query GetSlide($slide: ID!) {
    Slide(where: { id: $slide }) {
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
`;

const UPDATE_SLIDE_TITLE = gql`
  mutation UpdateSlideTitle($slide: ID!, $value: String) {
    updateSlide(id: $slide, data: { title: $value }) {
      id
      title
    }
  }
`;

const UPDATE_SLIDE_DESCRIPTION = gql`
  mutation UpdateSlideTitle($slide: ID!, $value: String) {
    updateSlide(id: $slide, data: { description: $value }) {
      id
      description
    }
  }
`;

const UPDATE_VIEWPORT = gql`
  mutation UpdateViewport(
    $slide: ID!
    $longitude: Float
    $latitude: Float
    $zoom: Float
    $bearing: Float
    $pitch: Float
  ) {
    updateSlide(
      id: $slide
      data: {
        longitude: $longitude
        latitude: $latitude
        zoom: $zoom
        bearing: $bearing
        pitch: $pitch
      }
    ) {
      id
      longitude
      latitude
      zoom
      bearing
      pitch
    }
  }
`;

let updateTimer;

const Editor = ({ slide }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [viewport, setViewport] = useState({});

  const { loading, error, data } = useQuery(GET_SLIDES, {
    variables: { slide },
  });

  useEffect(() => {
    setTitle(loading ? '' : data.Slide.title || '');
    setDescription(loading ? '' : data.Slide.description || '');
    setViewport(
      loading ? {} : pick(data.Slide, ['longitude', 'latitude', 'zoom', 'bearing', 'pitch'])
    );
  }, [loading, data]);

  const [updateTitle] = useMutation(UPDATE_SLIDE_TITLE);
  const [updateDescription] = useMutation(UPDATE_SLIDE_DESCRIPTION);
  const [updateViewport] = useMutation(UPDATE_VIEWPORT);

  const updateInterval = (value, updater) => {
    clearTimeout(updateTimer);
    updateTimer = setTimeout(() => {
      updater({
        variables: {
          slide,
          ...value,
        },
      });
    }, 1000);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width={6}>
          <Form>
            <Form.Field>
              <label>Title</label>
              <Input
                value={title}
                onChange={(e, { value }) => {
                  setTitle(value);
                  updateInterval({ value }, updateTitle);
                }}
              />
            </Form.Field>
            <Form.Field>
              <label>Description</label>
              <Form.TextArea
                value={description}
                onChange={(e, { value }) => {
                  setDescription(value);
                  updateInterval({ value }, updateDescription);
                }}
              />
            </Form.Field>
          </Form>
        </Grid.Column>
        <Grid.Column width={10}>
          {viewport.latitude && viewport.longitude && (
            <Atlas
              handler={newViewport => {
                setViewport(newViewport);
                updateInterval(newViewport, updateViewport);
              }}
              viewport={viewport}
            />
          )}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

Editor.propTypes = {
  slide: PropTypes.string.isRequired,
};

export default Editor;
