/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation, gql } from '@apollo/client';
import { pick } from 'lodash';
import { Grid, Form, Input } from 'semantic-ui-react';
import { Editor as Wysiwyg } from '@tinymce/tinymce-react';

import Atlas from '../Atlas';
import Image from '../Image';
import MapControl from '../MapControl';

import styles from './Editor.module.css';

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
      image {
        id
        title
        creator
        source
        date
        url
      }
      disabledLayers: layers {
        id
        layerId
      }
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

const UPDATE_SLIDE_YEAR = gql`
  mutation UpdateSlideTitle($slide: ID!, $value: Int) {
    updateSlide(id: $slide, data: { year: $value }) {
      id
      year
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

const UPDATE_LAYERS = gql`
  mutation UpdateLayers($slide: ID!, $layers: LayerRelateToManyInput) {
    updateSlide(id: $slide, data: { layers: $layers }) {
      id
      layers {
        layerId
      }
    }
  }
`;

const ADD_IMAGE = gql`
  mutation AddImage($slide: SlideRelateToOneInput) {
    createImage(data: { slide: $slide }) {
      id
      title
      creator
      source
      date
      url
    }
  }
`;

const UPDATE_IMAGE = gql`
  mutation UpdateImage(
    $image: ID!
    $title: String
    $creator: String
    $source: String
    $date: String
    $url: String
  ) {
    updateImage(
      id: $image
      data: { title: $title, creator: $creator, source: $source, date: $date, url: $url }
    ) {
      id
      title
      creator
      source
      date
      url
    }
  }
`;

let updateTimer;

const Editor = ({ slide, layers }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [viewport, setViewport] = useState({});
  const [disabledLayers, setDisabledLayers] = useState({});
  const [year, setYear] = useState(1900);

  const { loading, error, data, refetch } = useQuery(GET_SLIDES, {
    variables: { slide },
  });

  useEffect(() => {
    setTitle(loading ? '' : data.Slide.title || '');
    setDescription(loading ? '' : data.Slide.description || '');
    setYear(loading ? 1900 : data.Slide.year);
    setDisabledLayers(loading ? [] : data.Slide.disabledLayers);
    setViewport(
      loading ? {} : pick(data.Slide, ['longitude', 'latitude', 'zoom', 'bearing', 'pitch'])
    );
  }, [loading, data]);

  const [updateTitle] = useMutation(UPDATE_SLIDE_TITLE);
  const [updateDescription] = useMutation(UPDATE_SLIDE_DESCRIPTION);
  const [updateViewport] = useMutation(UPDATE_VIEWPORT);
  const [updateYear] = useMutation(UPDATE_SLIDE_YEAR);
  const [updateLayers] = useMutation(UPDATE_LAYERS);
  const [addImage] = useMutation(ADD_IMAGE);
  const [updateImage] = useMutation(UPDATE_IMAGE);

  const updateInterval = (value, updater, id, interval = 1000) => {
    clearTimeout(updateTimer);
    updateTimer = setTimeout(() => {
      updater({
        variables: {
          ...id,
          ...value,
        },
      });
    }, interval);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Grid stretched style={{ height: '100%', margin: 0 }}>
      <Grid.Row style={{ padding: 0 }}>
        <Grid.Column width={6} className={styles.editor}>
          <Form size="large">
            <Form.Field>
              <label>Card Title</label>
              <Input
                value={title}
                onChange={(e, { value }) => {
                  setTitle(value);
                  updateInterval({ value }, updateTitle, { slide });
                }}
              />
            </Form.Field>
            <Form.Field>
              <label>Card Description</label>
              <Wysiwyg
                apiKey="t0o761fz7mpxbpfouwngyrmyh89mhclnprer8e3bdkch7slf"
                value={description}
                init={{
                  height: 400,
                  menubar: false,
                  plugins: ['link lists'],
                  toolbar: 'bold italic bullist numlist | link unlink | undo redo',
                  branding: false,
                  statusbar: false,
                }}
                onEditorChange={value => {
                  setDescription(value);
                  updateInterval({ value }, updateDescription, { slide });
                }}
              />
              <Image
                image={data.Slide.image}
                addHandler={() =>
                  addImage({
                    variables: {
                      slide: {
                        connect: {
                          id: slide,
                        },
                      },
                    },
                  }).then(refetch)
                }
                updateHandler={(id, values, interval) =>
                  updateInterval(values, updateImage, { image: id }, interval)
                }
              />
            </Form.Field>
          </Form>
        </Grid.Column>
        <Grid.Column width={10} style={{ padding: 0 }}>
          {viewport.latitude && viewport.longitude && (
            <>
              <Atlas
                handler={newViewport => {
                  setViewport(newViewport);
                  updateInterval(newViewport, updateViewport, { slide });
                }}
                viewport={viewport}
                year={year}
                disabledLayers={disabledLayers}
              />
              <MapControl
                year={year}
                yearHandler={newYear => {
                  setYear(newYear);
                  updateInterval({ value: newYear }, updateYear, { slide });
                }}
                layers={layers}
                disabledLayers={disabledLayers}
                layerHandler={newLayers => {
                  setDisabledLayers(newLayers);
                  updateInterval(
                    {
                      layers: {
                        connect: newLayers.map(nl => ({ id: nl.id })),
                      },
                    },
                    updateLayers,
                    { slide }
                  );
                }}
              />
            </>
          )}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

Editor.propTypes = {
  slide: PropTypes.string.isRequired,
  layers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default Editor;
