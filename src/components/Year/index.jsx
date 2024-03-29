/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Form, Input } from 'semantic-ui-react';
import { Slider } from 'react-semantic-ui-range';

import debouncedMutation from '../../providers/debouncedMutation';
import useLocale from '../../hooks/useLocale';

import styles from './Year.module.css';

export const GET_SLIDE_YEAR = gql`
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
  const { year } = useLocale();

  const [tempYear, setTempYear] = useState('');
  const [inputYear, setInputYear] = useState(1900);
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
        <label className={styles.yearLabel}>{`${year}: `}</label>
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
    </>
  );
};

Year.propTypes = {
  slide: PropTypes.string.isRequired,
};

export default Year;
