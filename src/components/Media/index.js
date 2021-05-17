/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Segment, Form, Input } from 'semantic-ui-react';

import debouncedMutation from '../../providers/debouncedMutation';

export const GET_SLIDE_MEDIA = gql`
  query GetSlideMedia($slide: ID!) {
    Slide(where: { id: $slide }) {
      id
      youtube
      soundcloud
    }
  }
`;

const UPDATE_SLIDE_YOUTUBE = gql`
  mutation UpdateSlideYoutube($slide: ID!, $youtube: String) {
    updateSlide(id: $slide, data: { youtube: $youtube }) {
      id
      youtube
    }
  }
`;

const UPDATE_SLIDE_SOUNDCLOUD = gql`
  mutation UpdateSlideSoundcloud($slide: ID!, $soundcloud: String) {
    updateSlide(id: $slide, data: { soundcloud: $soundcloud }) {
      id
      soundcloud
    }
  }
`;

const Media = ({ slide }) => {
  const { loading, data } = useQuery(GET_SLIDE_MEDIA, {
    variables: { slide },
  });

  const [youtube, setYoutube] = useState('');
  const [soundcloud, setSoundcloud] = useState('');

  useEffect(() => {
    setYoutube(loading && !data ? '' : data.Slide.youtube || '');
    setSoundcloud(loading && !data ? '' : data.Slide.soundcloud || '');
  }, [loading, data]);

  const [updateYoutube] = useMutation(UPDATE_SLIDE_YOUTUBE);
  const [updateSoundcloud] = useMutation(UPDATE_SLIDE_SOUNDCLOUD);

  const youtubeTimer = useRef();
  const soundcloudTimer = useRef();

  return (
    <Form.Field>
      <label>Media</label>
      <Segment style={{ marginTop: 0 }}>
        <Form.Field>
          <label>Youtube: </label>
          <Input
            placeholder="Youtube URL"
            icon="linkify"
            iconPosition="left"
            value={youtube}
            onChange={(e, { value }) => {
              setYoutube(value);
              youtubeTimer.current = debouncedMutation({
                slide,
                timerRef: youtubeTimer,
                mutation: updateYoutube,
                values: { youtube: value },
              });
            }}
          />
        </Form.Field>
        <Form.Field>
          <label>Soundcloud: </label>
          <Input
            placeholder="Soundcloud URL"
            icon="linkify"
            iconPosition="left"
            value={soundcloud}
            onChange={(e, { value }) => {
              setSoundcloud(value);
              soundcloudTimer.current = debouncedMutation({
                slide,
                timerRef: soundcloudTimer,
                mutation: updateSoundcloud,
                values: { soundcloud: value },
              });
            }}
          />
        </Form.Field>
      </Segment>
    </Form.Field>
  );
};

Media.propTypes = {
  slide: PropTypes.string.isRequired,
};

export default Media;
