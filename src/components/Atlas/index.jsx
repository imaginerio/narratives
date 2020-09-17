import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ReactMapGL from 'react-map-gl';
import { map as mapProp } from 'lodash';

const Atlas = ({ handler, viewport, year, scrollZoom, disabledLayers }) => {
  const mapRef = useRef(null);

  const [mapViewport, setMapViewport] = useState(viewport);

  useEffect(() => setMapViewport(viewport), [viewport]);

  useEffect(() => {
    const map = mapRef.current.getMap();
    let style = null;
    try {
      style = map.getStyle();
    } catch (err) {
      style = null;
    } finally {
      if (style) {
        style.layers = style.layers.map(layer => {
          if (layer.source === 'composite') {
            const filter =
              layer.filter && layer.filter[1][0] === 'match' ? layer.filter.slice(0, 2) : ['all'];
            return {
              ...layer,
              filter: [
                ...filter,
                ['<=', ['get', 'firstyear'], year],
                ['>=', ['get', 'lastyear'], year],
              ],
            };
          }
          return layer;
        });
        map.setStyle(style);
      }
    }
  }, [year]);

  useEffect(() => {
    const layerIds = mapProp(disabledLayers, 'layerId');
    const map = mapRef.current.getMap();
    let style = null;
    try {
      style = map.getStyle();
    } catch (err) {
      style = null;
    } finally {
      if (style) {
        style.layers = style.layers.map(layer => {
          const layout = layer.layout || {};
          if (layerIds.includes(layer['source-layer'])) {
            layout.visibility = 'none';
          } else {
            layout.visibility = 'visible';
          }
          return {
            ...layer,
            layout,
          };
        });
        map.setStyle(style);
      }
    }
  }, [disabledLayers]);

  const onViewportChange = nextViewport => {
    setMapViewport(nextViewport);
    handler(nextViewport);
  };

  return (
    <ReactMapGL
      ref={mapRef}
      mapboxApiAccessToken="pk.eyJ1IjoiYXhpc21hcHMiLCJhIjoieUlmVFRmRSJ9.CpIxovz1TUWe_ecNLFuHNg"
      mapStyle="/style.json"
      width="100%"
      height="100%"
      scrollZoom={scrollZoom}
      {...mapViewport}
      onViewportChange={onViewportChange}
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
  year: PropTypes.number.isRequired,
  scrollZoom: PropTypes.bool,
  disabledLayers: PropTypes.arrayOf(PropTypes.string),
};

Atlas.defaultProps = {
  scrollZoom: true,
  disabledLayers: [],
};

export default Atlas;
