import React from 'react';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';

import Year from '../Year';

import styles from './MapControl.module.css';

const MapControl = ({ year, yearHandler }) => (
  <Segment className={styles.control}>
    <Year year={year} handler={yearHandler} />
  </Segment>
);

MapControl.propTypes = {
  year: PropTypes.number.isRequired,
  yearHandler: PropTypes.func.isRequired,
};

export default MapControl;
