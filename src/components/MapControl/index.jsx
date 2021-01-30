import React from 'react';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';

import Year from '../Year';
import Layers from '../Layers';
import Search from '../Search';

import styles from './MapControl.module.css';

const MapControl = ({
  year,
  layers,
  basemaps,
  disabledLayers,
  activeBasemap,
  layerHandler,
  slide,
  featureHandler,
  selectedFeature,
}) => (
  <Segment className={styles.control}>
    <div style={{ float: 'right', width: 85 }}>
      <Layers
        slide={slide}
        year={year}
        layers={layers}
        basemaps={basemaps}
        disabledLayers={disabledLayers}
        activeBasemap={activeBasemap}
        layerHandler={layerHandler}
      />
      <Search
        year={year}
        layers={layers}
        handler={featureHandler}
        selectedFeature={selectedFeature}
      />
    </div>
    <Year slide={slide} />
  </Segment>
);

MapControl.propTypes = {
  slide: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  layers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  basemaps: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  disabledLayers: PropTypes.arrayOf(PropTypes.string),
  activeBasemap: PropTypes.shape(),
  layerHandler: PropTypes.func.isRequired,
  featureHandler: PropTypes.func.isRequired,
  selectedFeature: PropTypes.string,
};

MapControl.defaultProps = {
  disabledLayers: [],
  activeBasemap: null,
  selectedFeature: null,
};

export default MapControl;
