import React from 'react';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';

import Year from '../Year';
import Layers from '../Layers';
import Search from '../Search';

import styles from './MapControl.module.css';

const MapControl = ({
  year,
  yearHandler,
  layers,
  disabledLayers,
  layerHandler,
  featureHandler,
}) => (
  <Segment className={styles.control}>
    <div style={{ float: 'right', width: 85 }}>
      <Layers layers={layers} disabledLayers={disabledLayers} layerHandler={layerHandler} />
      <Search year={year} layers={layers} handler={featureHandler} />
    </div>
    <Year year={year} handler={yearHandler} />
  </Segment>
);

MapControl.propTypes = {
  year: PropTypes.number.isRequired,
  yearHandler: PropTypes.func.isRequired,
  layers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  disabledLayers: PropTypes.arrayOf(PropTypes.string),
  layerHandler: PropTypes.func.isRequired,
  featureHandler: PropTypes.func.isRequired,
};

MapControl.defaultProps = {
  disabledLayers: [],
};

export default MapControl;
