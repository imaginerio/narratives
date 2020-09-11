import React from 'react';
import PropTypes from 'prop-types';
import ReactMapGL from 'react-map-gl';

const Atlas = ({ handler, viewport }) => {
  return (
    <ReactMapGL
      mapboxApiAccessToken="pk.eyJ1IjoiYXhpc21hcHMiLCJhIjoieUlmVFRmRSJ9.CpIxovz1TUWe_ecNLFuHNg"
      mapStyle="/style.json"
      width="100%"
      height="100%"
      {...viewport}
      onViewportChange={nextViewport => handler(nextViewport)}
    />
  );
};

Atlas.propTypes = {
  handler: PropTypes.func.isRequired,
  viewport: PropTypes.shape({
    longitude: PropTypes.number,
    latitude: PropTypes.number,
    zoom: PropTypes.number,
    bearing: PropTypes.number,
    pitch: PropTypes.number,
  }).isRequired,
};

export default Atlas;
