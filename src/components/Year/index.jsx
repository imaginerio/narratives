/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Form, Input, Modal, Header, Icon, Button } from 'semantic-ui-react';
import { Slider } from 'react-semantic-ui-range';

import debouncedMutation from '../../lib/debouncedMutation';

import styles from './Year.module.css';

const GET_SLIDE_YEAR = gql`
  query GetSlideYear($slide: ID!) {
    Slide(where: { id: $slide }) {
      id
      year
    }
  }
`;

const UPDATE_SLIDE_YEAR = gql`
  mutation UpdateSlideYear($slide: ID!, $year: Int) {
    updateSlide(id: $slide, data: { year: $year }) {
      id
      year
    }
  }
`;

const Year = ({ slide }) => {
  const { loading, error, data } = useQuery(GET_SLIDE_YEAR, {
    variables: { slide },
  });
  const [onUpdateYear] = useMutation(UPDATE_SLIDE_YEAR);
  const yearTimer = useRef();

  const [tempYear, setTempYear] = useState(null);
  const [inputYear, setInputYear] = useState(1900);
  const [open, setOpen] = useState(false);
  const [rangeError, setRangeError] = useState(false);

  useEffect(() => {
    if (tempYear && data && tempYear !== data.Slide.year) {
      yearTimer.current = debouncedMutation({
        slide,
        timerRef: yearTimer,
        mutation: onUpdateYear,
        values: { year: tempYear },
      });
    }
    setInputYear(tempYear);
  }, [tempYear]);

  useEffect(() => {
    if (data) {
      setTempYear(data.Slide.year);
      setInputYear(data.Slide.year);
    }
  }, [loading, data]);

  const syncYear = () => {
    const newYear = parseInt(inputYear, 10);
    if (newYear && newYear >= 1502 && newYear <= 2021) {
      setRangeError(false);
      setTempYear(newYear);
    } else {
      setRangeError(true);
    }
  };

  return (
    <>
      <Form.Field id="yearInput" inline error={error} disabled={loading}>
        <label className={styles.yearLabel}>Year: </label>
        <Input
          className={styles.yearInput}
          type="number"
          value={inputYear}
          error={rangeError}
          onKeyPress={({ key }) => {
            if (key === 'Enter') syncYear();
          }}
          onChange={(e, { value }) => setInputYear(value)}
          onBlur={syncYear}
        />
        <div className={styles.yearSlider}>
          <Slider
            value={tempYear}
            discrete
            inverted={false}
            settings={{
              value: tempYear,
              min: 1502,
              max: 2021,
              step: 1,
              onChange: setTempYear,
            }}
          />
        </div>
      </Form.Field>
      <Modal
        basic
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        size="small"
      >
        <Header icon>
          <Icon name="calendar times outline" />
          Are you sure you want to change the year?
        </Header>
        <Modal.Content>
          <p>{`You have a selected feature or basemap selected that is tied to ${tempYear}. Changing the year will remove these selections.`}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button basic color="red" inverted onClick={() => setOpen(false)}>
            <Icon name="remove" />
            <span>{`Keep ${tempYear}`}</span>
          </Button>
          <Button
            negative
            inverted
            onClick={() => {
              setOpen(false);
            }}
          >
            <Icon name="trash" />
            <span>Clear selection and change year</span>
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

Year.propTypes = {
  slide: PropTypes.string.isRequired,
};

export default Year;
