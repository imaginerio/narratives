/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation, gql } from '@apollo/client';
import { pick } from 'lodash';
import { Grid, Form, Input, Dropdown, Button, Icon, Modal, Header } from 'semantic-ui-react';
import { Editor as Wysiwyg } from '@tinymce/tinymce-react';

import AtlasContext from '../Atlas/Context';
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
      size
      longitude
      latitude
      zoom
      bearing
      pitch
      selectedFeature
      opacity
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
      basemap {
        id
        ssid
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
  mutation UpdateSlideDescription($slide: ID!, $value: String) {
    updateSlide(id: $slide, data: { description: $value }) {
      id
      description
    }
  }
`;

const UPDATE_SLIDE_SIZE = gql`
  mutation UpdateSlideSize($slide: ID!, $value: SlideSizeType) {
    updateSlide(id: $slide, data: { size: $value }) {
      id
      size
    }
  }
`;

const UPDATE_SLIDE_FEATURE = gql`
  mutation UpdateSlideFeature($slide: ID!, $value: String) {
    updateSlide(id: $slide, data: { selectedFeature: $value }) {
      id
      selectedFeature
    }
  }
`;

const UPDATE_LAYERS = gql`
  mutation UpdateLayers($slide: ID!, $layers: LayerRelateToManyInput) {
    updateSlide(id: $slide, data: { layers: $layers }) {
      id
      layers {
        id
        layerId
      }
    }
  }
`;

const UPDATE_BASEMAP = gql`
  mutation UpdateBasemap($slide: ID!, $basemap: BasemapRelateToOneInput) {
    updateSlide(id: $slide, data: { basemap: $basemap }) {
      id
      basemap {
        id
        ssid
      }
    }
  }
`;

const UPDATE_SLIDE_OPACITY = gql`
  mutation UpdateSlideTitle($slide: ID!, $value: Float) {
    updateSlide(id: $slide, data: { opacity: $value }) {
      id
      opacity
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

const Editor = ({ slide, layers, basemaps, removeSlide }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [disabledLayers, setDisabledLayers] = useState({});
  const [activeBasemap, setActiveBasemap] = useState({});
  const [opacity, setOpacity] = useState(0);
  const [imageMeta, setImageMeta] = useState(null);
  const [year, setYear] = useState(1900);
  const [size, setSize] = useState('Small');
  const [open, setOpen] = useState(false);

  const { loading, error, data } = useQuery(GET_SLIDES, {
    variables: { slide },
  });

  useEffect(() => {
    setTitle(loading && !data ? '' : data.Slide.title || '');
    setDescription(loading && !data ? '' : data.Slide.description || '');
    setYear(loading && !data ? 1900 : data.Slide.year);
    setSize(loading && !data ? 'Small' : data.Slide.size);
    setDisabledLayers(loading && !data ? [] : data.Slide.disabledLayers);
    setActiveBasemap(loading && !data ? null : data.Slide.basemap);
    setOpacity(loading && !data ? 0 : data.Slide.opacity);
    setImageMeta(loading && !data ? null : data.Slide.image);
    setSelectedFeature(loading && !data ? null : data.Slide.selectedFeature);
  }, [loading, data]);

  const [updateTitle] = useMutation(UPDATE_SLIDE_TITLE);
  const [updateDescription] = useMutation(UPDATE_SLIDE_DESCRIPTION);
  const [updateSize] = useMutation(UPDATE_SLIDE_SIZE);
  const [updateLayers] = useMutation(UPDATE_LAYERS);
  const [updateBasemap] = useMutation(UPDATE_BASEMAP);
  const [updateOpacity] = useMutation(UPDATE_SLIDE_OPACITY);
  const [updateFeature] = useMutation(UPDATE_SLIDE_FEATURE);
  const [addImage] = useMutation(ADD_IMAGE);
  const [updateImage] = useMutation(UPDATE_IMAGE);

  const titleTimer = useRef();
  const onTitleChange = newTitle => {
    clearTimeout(titleTimer.current);
    titleTimer.current = setTimeout(() => {
      updateTitle({
        variables: {
          slide,
          value: newTitle,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateSlide: {
            __typename: 'Slide',
            id: slide,
            title: newTitle,
          },
        },
      });
    }, 500);
  };

  const descriptionTimer = useRef();
  const onDescriptionChange = newDescription => {
    clearTimeout(descriptionTimer.current);
    descriptionTimer.current = setTimeout(() => {
      updateDescription({
        variables: {
          slide,
          value: newDescription,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateSlide: {
            __typename: 'Slide',
            id: slide,
            description: newDescription,
          },
        },
      });
    }, 500);
  };

  const sizeTimer = useRef();
  const onSizeChange = newSize => {
    clearTimeout(sizeTimer.current);
    sizeTimer.current = setTimeout(() => {
      updateSize({
        variables: {
          slide,
          value: newSize,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateSlide: {
            __typename: 'Slide',
            id: slide,
            size: newSize,
          },
        },
      });
    }, 500);
  };

  const featureTimer = useRef();
  const onFeatureChange = newFeature => {
    clearTimeout(featureTimer.current);
    featureTimer.current = setTimeout(() => {
      updateFeature({
        variables: {
          slide,
          value: newFeature,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateSlide: {
            __typename: 'Slide',
            id: slide,
            selectedFeature: newFeature,
          },
        },
      });
    }, 500);
  };

  const layersTimer = useRef();
  const onLayersChange = newLayers => {
    clearTimeout(layersTimer.current);
    layersTimer.current = setTimeout(() => {
      updateLayers({
        variables: {
          slide,
          layers: {
            connect: newLayers.map(nl => ({ id: nl.id })),
            disconnectAll: true,
          },
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateSlide: {
            __typename: 'Slide',
            id: slide,
            layers: newLayers.map(l => ({
              __typename: 'Layer',
              ...pick(l, 'id', 'layerId'),
            })),
          },
        },
      });
    }, 500);
  };

  const basemapTimer = useRef();
  const onBasemapChange = newBasemap => {
    clearTimeout(basemapTimer.current);
    basemapTimer.current = setTimeout(() => {
      let basemap = { disconnectAll: true };
      if (newBasemap) {
        basemap = {
          connect: { id: newBasemap.id },
        };
      }
      updateBasemap({
        variables: {
          slide,
          basemap,
          optimisticResponse: {
            __typename: 'Mutation',
            updateSlide: {
              __typename: 'Slide',
              id: slide,
              basemap: {
                __typename: 'Basemap',
                ...pick(newBasemap, 'id', 'ssid'),
              },
            },
          },
        },
      });
    }, 500);
  };

  const opacityTimer = useRef();
  const onOpacityChange = newOpacity => {
    clearTimeout(opacityTimer.current);
    opacityTimer.current = setTimeout(() => {
      updateOpacity({
        variables: {
          slide,
          value: newOpacity,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateSlide: {
            __typename: 'Slide',
            id: slide,
            opacity: newOpacity,
          },
        },
      });
    }, 500);
  };

  const imageTimer = useRef();
  const onImageChange = (image, imageValues) => {
    clearTimeout(imageTimer.current);
    imageTimer.current = setTimeout(() => {
      updateImage({
        variables: {
          image,
          ...imageValues,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateImage: {
            __typename: 'Image',
            id: image,
            ...imageValues,
          },
        },
      });
    }, 500);
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
                  onTitleChange(value);
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
                  plugins: ['link lists paste'],
                  toolbar: 'bold italic superscript bullist numlist | link unlink | undo redo',
                  branding: false,
                  statusbar: false,
                  paste_as_text: true,
                }}
                onEditorChange={value => {
                  setDescription(value);
                  onDescriptionChange(value);
                }}
              />
            </Form.Field>
            <Form.Field>
              <label>Size</label>
              <Dropdown
                placeholder="Select Size"
                fluid
                selection
                value={size}
                options={[
                  { text: 'Fullscreen', value: 'Fullscreen' },
                  { text: 'Medium', value: 'Medium' },
                  { text: 'Small', value: 'Small' },
                ]}
                onChange={(e, { value }) => {
                  setSize(value);
                  onSizeChange(value);
                }}
              />
            </Form.Field>
            <Form.Field>
              <label>Image</label>
              <Image
                image={imageMeta}
                addHandler={() =>
                  addImage({
                    variables: {
                      slide: {
                        connect: {
                          id: slide,
                        },
                      },
                    },
                    refetchQueries: [{ query: GET_SLIDES, variables: { slide } }],
                  })
                }
                updateHandler={(id, value) => {
                  setImageMeta({ ...imageMeta, ...value });
                  onImageChange(id, value);
                }}
              />
            </Form.Field>
            <Form.Field>
              <Modal
                basic
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
                size="small"
                trigger={
                  <Button negative fluid labelPosition="left" icon="trash" content="Delete Slide" />
                }
              >
                <Header icon>
                  <Icon name="trash" />
                  Delete this slide?
                </Header>
                <Modal.Content>
                  <p>
                    Are you sure you want to delete this slide? This action is permanent and cannot
                    be undone.
                  </p>
                </Modal.Content>
                <Modal.Actions>
                  <Button basic color="red" inverted onClick={() => setOpen(false)}>
                    <Icon name="remove" />
                    <span>No</span>
                  </Button>
                  <Button
                    negative
                    inverted
                    onClick={() => {
                      setOpen(false);
                      removeSlide(slide);
                    }}
                  >
                    <Icon name="trash" />
                    <span>Yes</span>
                  </Button>
                </Modal.Actions>
              </Modal>
            </Form.Field>
          </Form>
        </Grid.Column>
        <Grid.Column width={10} style={{ padding: 0 }}>
          <AtlasContext slide={slide} />
          <MapControl
            year={year}
            slide={slide}
            layers={layers}
            basemaps={basemaps}
            disabledLayers={disabledLayers}
            activeBasemap={activeBasemap}
            layerHandler={newLayers => {
              setDisabledLayers(newLayers);
              onLayersChange(newLayers);
            }}
            basemapHandler={newBasemap => {
              setActiveBasemap(newBasemap);
              onBasemapChange(newBasemap);
            }}
            opacityHandler={newOpacity => {
              setOpacity(newOpacity);
              onOpacityChange(newOpacity);
            }}
            opacity={opacity}
            featureHandler={newFeature => {
              setSelectedFeature(newFeature);
              onFeatureChange(newFeature);
            }}
            selectedFeature={selectedFeature}
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

Editor.propTypes = {
  slide: PropTypes.string.isRequired,
  layers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  basemaps: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  removeSlide: PropTypes.func.isRequired,
};

export default Editor;
