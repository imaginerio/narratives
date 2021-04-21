/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Grid, Segment, Form, Input, Dropdown, Dimmer, Loader } from 'semantic-ui-react';
import { Editor as Wysiwyg } from '@tinymce/tinymce-react';

import AtlasContext from '../Atlas/Context';
import Image from '../Image';
import Year from '../Year';
import Layers from '../Layers';
import Search from '../Search';
import Confirm from '../Confirm';

import styles from './Editor.module.css';

const GET_SLIDES = gql`
  query GetSlide($slide: ID!) {
    Slide(where: { id: $slide }) {
      id
      title
      description
      size
      image {
        id
        title
        creator
        source
        date
        url
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

const Editor = ({ slide, removeSlide }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageMeta, setImageMeta] = useState(null);
  const [size, setSize] = useState('Small');

  const { loading, error, data } = useQuery(GET_SLIDES, {
    variables: { slide },
  });

  useEffect(() => {
    setTitle(loading && !data ? '' : data.Slide.title || '');
    setDescription(loading && !data ? '' : data.Slide.description || '');
    setSize(loading && !data ? 'Small' : data.Slide.size);
    setImageMeta(loading && !data ? null : data.Slide.image);
  }, [loading, data]);

  const [updateTitle] = useMutation(UPDATE_SLIDE_TITLE);
  const [updateDescription] = useMutation(UPDATE_SLIDE_DESCRIPTION);
  const [updateSize] = useMutation(UPDATE_SLIDE_SIZE);
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

  if (loading)
    return (
      <Dimmer active>
        <Loader size="huge">Loading</Loader>
      </Dimmer>
    );
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
              <Confirm
                buttonIcon="trash"
                buttonTitle="Delete Slide"
                confirmTitle="Delete this slide?"
                confirmHandler={() => removeSlide(slide)}
              >
                <p>
                  Are you sure you want to delete this slide? This action is permanent and cannot be
                  undone.
                </p>
              </Confirm>
            </Form.Field>
          </Form>
        </Grid.Column>
        <Grid.Column width={10} style={{ padding: 0 }}>
          <AtlasContext slide={slide} />
          <Segment className={styles.control}>
            <div style={{ float: 'right', width: 85 }}>
              <Layers slide={slide} />
              <Search slide={slide} />
            </div>
            <Year slide={slide} />
          </Segment>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

Editor.propTypes = {
  slide: PropTypes.string.isRequired,
  removeSlide: PropTypes.func.isRequired,
};

export default Editor;
