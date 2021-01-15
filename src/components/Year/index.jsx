/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'semantic-ui-react';
import { Slider } from 'react-semantic-ui-range';

import styles from './Year.module.css';

const Year = ({ year, handler }) => {
  const [inputYear, setInputYear] = useState(year);
  const [sliderYear, setSliderYear] = useState(year);
  const [error, setError] = useState(false);

  useEffect(() => {
    setInputYear(year);
    setSliderYear(year);
  }, [year]);

  return (
    <Form.Field inline>
      <label className={styles.yearLabel}>Year: </label>
      <Input
        className={styles.yearInput}
        type="number"
        value={inputYear}
        error={error}
        onChange={(e, { value }) => {
          const newYear = parseInt(value, 10);
          setInputYear(newYear);
          if (newYear && newYear >= 1502 && newYear <= 2021) {
            setError(false);
            if (newYear !== year) {
              handler(newYear);
            }
          } else {
            setError(true);
          }
        }}
      />
      <div className={styles.yearSlider}>
        <Slider
          value={sliderYear}
          discrete
          inverted={false}
          settings={{
            value: sliderYear,
            min: 1502,
            max: 2021,
            step: 1,
            onChange: handler,
          }}
        />
      </div>
    </Form.Field>
  );
};

Year.propTypes = {
  year: PropTypes.number.isRequired,
  handler: PropTypes.func.isRequired,
};

export default Year;
