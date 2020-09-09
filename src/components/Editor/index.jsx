import React from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Grid, Form, Input } from 'semantic-ui-react';

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

const Editor = ({ slide }) => {
  const { loading, error, data } = useQuery(GET_SLIDES, {
    variables: { slide },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width={6}>
          <Form>
            <Form.Field>
              <label>Title</label>
              <Input value={data.Slide.title || ''} />
            </Form.Field>
            <Form.Field>
              <label>Description</label>
              <Form.TextArea />
            </Form.Field>
          </Form>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

Editor.propTypes = {
  slide: PropTypes.string.isRequired,
};

export default Editor;
