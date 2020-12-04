import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ReactMapGL, { Source, Layer } from 'react-map-gl';
import axios from 'axios';
import { map as mapProp } from 'lodash';

const Atlas = ({ handler, viewport, year, scrollZoom, disabledLayers, selectedFeature }) => {
  const mapRef = useRef(null);

  const [mapViewport, setMapViewport] = useState(viewport);
  const [featureData, setFeatureData] = useState(null);

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
  });

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
  });

  useEffect(() => {
    const { layerid, objectid } = selectedFeature;
    const loadGeoJSON = async () => {
      const { data } = await axios.get(
        `https://arcgis.rice.edu/arcgis/rest/services/imagineRio_Data/FeatureServer/${layerid}/query?where=objectid=${objectid}&f=geojson`
      );
      setFeatureData(data);
    };
    if (layerid && objectid) {
      loadGeoJSON();
    } else {
      setFeatureData(null);
    }
  }, [selectedFeature]);

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
    >
      <Source type="geojson" data={featureData}>
        <Layer id="selected" type="line" />
        <Layer id="selected" type="line" />
      </Source>
    </ReactMapGL>
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
  selectedFeature: PropTypes.shape({
    layerid: PropTypes.number.isRequired,
    objectid: PropTypes.number.isRequired,
  }),
};

Atlas.defaultProps = {
  scrollZoom: true,
  disabledLayers: [],
  selectedFeature: null,
};

export default Atlas;
