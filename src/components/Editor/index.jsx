/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/client';
import { Grid, Segment, Form, Input, Dropdown, Dimmer, Loader } from 'semantic-ui-react';

import {
  GET_SLIDES,
  UPDATE_SLIDE_TITLE,
  UPDATE_SLIDE_DESCRIPTION,
  UPDATE_SLIDE_SIZE,
  ADD_IMAGE,
  UPDATE_IMAGE,
} from './graphql';
import { useDraw } from '../../providers/DrawProvider';
import debouncedMutation from '../../providers/debouncedMutation';

import AtlasContext from '../Atlas/Context';
import Image from '../Image';
import Year from '../Year';
import Layers from '../Layers';
import Search from '../Search';
import Confirm from '../Confirm';
import Wysiwyg from '../Wysiwyg';
import DrawList from '../DrawList';

import styles from './Editor.module.css';

const Editor = ({ slide, removeSlide }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageMeta, setImageMeta] = useState(null);
  const [size, setSize] = useState('Small');

  const { loading, error, data } = useQuery(GET_SLIDES, {
    variables: { slide },
  });

  const [, dispatch] = useDraw();
  useEffect(() => dispatch(['SLIDE', slide]), [slide]);

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
  const descriptionTimer = useRef();
  const sizeTimer = useRef();

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
                  titleTimer.current = debouncedMutation({
                    slide,
                    timerRef: titleTimer,
                    mutation: updateTitle,
                    values: { title: value },
                  });
                }}
              />
            </Form.Field>
            <Wysiwyg
              label="Card Description"
              value={description}
              onEditorChange={value => {
                setDescription(value);
                descriptionTimer.current = debouncedMutation({
                  slide,
                  timerRef: descriptionTimer,
                  mutation: updateDescription,
                  values: { description: value },
                });
              }}
            />
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
                  sizeTimer.current = debouncedMutation({
                    slide,
                    timerRef: sizeTimer,
                    mutation: updateSize,
                    values: { size: value },
                  });
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
            <DrawList slide={slide} />
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
