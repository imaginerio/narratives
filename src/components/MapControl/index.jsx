import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment } from 'semantic-ui-react';

import Year from '../Year';
import Layers from '../Layers';

import styles from './MapControl.module.css';

const MapControl = ({ year, yearHandler, layers, disabledLayers, layerHandler }) => (
  <Segment className={styles.control}>
    <Grid>
      <Grid.Column width={14}>
        <Year year={year} handler={yearHandler} />
      </Grid.Column>
      <Grid.Column width={2}>
        <Layers layers={layers} disabledLayers={disabledLayers} layerHandler={layerHandler} />
      </Grid.Column>
    </Grid>
  </Segment>
);

MapControl.propTypes = {
  year: PropTypes.number.isRequired,
  yearHandler: PropTypes.func.isRequired,
  layers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  disabledLayers: PropTypes.arrayOf(PropTypes.string),
  layerHandler: PropTypes.func.isRequired,
};

MapControl.defaultProps = {
  disabledLayers: [],
};

export default MapControl;
