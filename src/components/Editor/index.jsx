import React from 'react';
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

const Editor = ({ slide }) => {
  const { loading, error, data } = useQuery(GET_SLIDES, {
    variables: { slide },
  });
  const [updateTitle] = useMutation(UPDATE_SLIDE_TITLE);
  const [updateDescription] = useMutation(UPDATE_SLIDE_DESCRIPTION);

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
                value={data.Slide.title || ''}
                onChange={(e, { value }) =>
                  updateTitle({
                    variables: {
                      slide,
                      value,
                    },
                  })
                }
              />
            </Form.Field>
            <Form.Field>
              <label>Description</label>
              <Form.TextArea
                value={data.Slide.description || ''}
                onChange={(e, { value }) =>
                  updateDescription({
                    variables: {
                      slide,
                      value,
                    },
                  })
                }
              />
            </Form.Field>
          </Form>
        </Grid.Column>
        <Grid.Column width={10}>
          <Atlas
            handler={console.log}
            initialViewport={pick(data.Slide, [
              'longitude',
              'latitude',
              'zoom',
              'bearing',
              'pitch',
            ])}
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

Editor.propTypes = {
  slide: PropTypes.string.isRequired,
};

export default Editor;
