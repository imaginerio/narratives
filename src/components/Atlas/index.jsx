import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactMapGL from 'react-map-gl';

const Atlas = ({ handler, initialViewport }) => {
  const [viewport, setViewport] = useState({
    width: 400,
    height: 400,
    ...initialViewport,
  });
  useEffect(() => handler(viewport), [viewport]);

  return (
    <ReactMapGL
      mapboxApiAccessToken="pk.eyJ1IjoiYXhpc21hcHMiLCJhIjoieUlmVFRmRSJ9.CpIxovz1TUWe_ecNLFuHNg"
      {...viewport}
      onViewportChange={nextViewport => setViewport(nextViewport)}
    />
  );
};

Atlas.propTypes = {
  handler: PropTypes.func.isRequired,
  initialViewport: PropTypes.shape({
    longitude: PropTypes.number,
    latitude: PropTypes.number,
    zoom: PropTypes.number,
    bearing: PropTypes.number,
    pitch: PropTypes.number,
  }).isRequired,
};

export default Atlas;
