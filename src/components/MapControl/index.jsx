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
  basemaps,
  disabledLayers,
  activeBasemap,
  layerHandler,
  basemapHandler,
  opacityHandler,
  opacity,
  featureHandler,
}) => (
  <Segment className={styles.control}>
    <div style={{ float: 'right', width: 85 }}>
      <Layers
        year={year}
        layers={layers}
        basemaps={basemaps}
        disabledLayers={disabledLayers}
        activeBasemap={activeBasemap}
        layerHandler={layerHandler}
        basemapHandler={basemapHandler}
        opacityHandler={opacityHandler}
        opacity={opacity}
      />
      <Search year={year} layers={layers} handler={featureHandler} />
    </div>
    <Year year={year} handler={yearHandler} />
  </Segment>
);

MapControl.propTypes = {
  year: PropTypes.number.isRequired,
  yearHandler: PropTypes.func.isRequired,
  layers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  basemaps: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  disabledLayers: PropTypes.arrayOf(PropTypes.string),
  activeBasemap: PropTypes.shape(),
  layerHandler: PropTypes.func.isRequired,
  basemapHandler: PropTypes.func.isRequired,
  featureHandler: PropTypes.func.isRequired,
  opacityHandler: PropTypes.func.isRequired,
  opacity: PropTypes.number,
};

MapControl.defaultProps = {
  disabledLayers: [],
  activeBasemap: null,
  opacity: 1,
};

export default MapControl;
