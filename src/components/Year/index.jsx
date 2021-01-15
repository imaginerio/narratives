/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Modal, Header, Icon, Button } from 'semantic-ui-react';
import { Slider } from 'react-semantic-ui-range';

import styles from './Year.module.css';

const Year = ({
  year,
  handler,
  activeBasemap,
  selectedFeature,
  basemapHandler,
  featureHandler,
}) => {
  const [inputYear, setInputYear] = useState(year);
  const [sliderYear, setSliderYear] = useState(year);
  const [tempYear, setTempYear] = useState(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setInputYear(year);
    setSliderYear(year);
    setTempYear(null);
  }, [year]);

  useEffect(() => {
    if (tempYear && tempYear !== year) {
      if (activeBasemap || selectedFeature) {
        setOpen(true);
      } else {
        handler(tempYear);
      }
    }
  }, [tempYear]);

  return (
    <>
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
              if (activeBasemap && selectedFeature) {
                setTempYear(newYear);
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
          <p>{`You have a selected feature or basemap selected that is tied to ${year}. Changing the year will remove these selections.`}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button basic color="red" inverted onClick={() => setOpen(false)}>
            <Icon name="remove" />
            <span>{`Keep ${year}`}</span>
          </Button>
          <Button
            negative
            inverted
            onClick={() => {
              setOpen(false);
              handler(tempYear);
              featureHandler(null);
              basemapHandler(null);
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
  year: PropTypes.number.isRequired,
  handler: PropTypes.func.isRequired,
  selectedFeature: PropTypes.string,
  featureHandler: PropTypes.func.isRequired,
  activeBasemap: PropTypes.shape(),
  basemapHandler: PropTypes.func.isRequired,
};

Year.defaultProps = {
  selectedFeature: null,
  activeBasemap: null,
};

export default Year;
