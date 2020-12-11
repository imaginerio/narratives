import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ReactMapGL, { Source, Layer, NavigationControl } from 'react-map-gl';
import axios from 'axios';
import { map as mapProp } from 'lodash';

const Atlas = ({
  handler,
  viewport,
  year,
  viewer,
  disabledLayers,
  selectedFeature,
  activeBasemap,
  opacity,
}) => {
  const mapRef = useRef(null);

  const [mapViewport, setMapViewport] = useState(viewport);
  const [featureData, setFeatureData] = useState(null);

  const setMapYear = () => {
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
  };

  const setDisabledLayers = () => {
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
  };

  useEffect(() => setMapViewport(viewport), [viewport]);
  useEffect(setMapYear, [year]);
  useEffect(setDisabledLayers, [disabledLayers]);

  useEffect(() => {
    const loadGeoJSON = async () => {
      const { data } = await axios.get(`https://search.imaginerio.org/feature/${selectedFeature}`);
      setFeatureData(data);
    };
    if (selectedFeature) {
      loadGeoJSON();
    } else {
      setFeatureData(null);
    }
  }, [selectedFeature]);

  const onViewportChange = nextViewport => {
    setMapViewport(nextViewport);
    handler(nextViewport);
  };

  const onMapLoad = () => {
    setMapYear();
    setDisabledLayers();
    onViewportChange(viewport);
  };

  const getMapProps = () => {
    let props = {
      ref: mapRef,
      mapboxApiAccessToken: 'pk.eyJ1IjoiYXhpc21hcHMiLCJhIjoieUlmVFRmRSJ9.CpIxovz1TUWe_ecNLFuHNg',
      mapStyle: '/style.json',
      width: '100%',
      height: '100%',
      onLoad: onMapLoad,
    };
    if (viewer) {
      props = {
        ...props,
        ...mapViewport,
        scrollZoom: false,
        onViewportChange,
      };
    } else {
      props = {
        ...props,
        ...viewport,
        onViewportChange: handler,
      };
    }
    return props;
  };

  return (
    <ReactMapGL {...getMapProps()}>
      {activeBasemap && (
        <Source
          type="raster"
          tiles={[
            `https://imaginerio-rasters.s3.us-east-1.amazonaws.com/${activeBasemap.ssid}/{z}/{x}/{y}.png`,
          ]}
          scheme="tms"
        >
          <Layer
            id="overlay"
            type="raster"
            paint={{ 'raster-opacity': opacity }}
            beforeId="expressway-label"
          />
        </Source>
      )}
      {selectedFeature && (
        <Source type="geojson" data={featureData}>
          <Layer
            id="selected-case"
            type="line"
            paint={{ 'line-width': 6, 'line-color': '#eeeeee' }}
            beforeId={activeBasemap ? 'overlay' : 'expressway-label'}
          />
          <Layer
            id="selected-line"
            type="line"
            paint={{ 'line-width': 3, 'line-color': '#000000' }}
            beforeId={activeBasemap ? 'overlay' : 'expressway-label'}
          />
        </Source>
      )}
      {!viewer && (
        <div style={{ position: 'absolute', left: 15, top: 100 }}>
          <NavigationControl />
        </div>
      )}
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
  viewer: PropTypes.bool,
  disabledLayers: PropTypes.arrayOf(PropTypes.shape()),
  activeBasemap: PropTypes.shape(),
  selectedFeature: PropTypes.string,
  opacity: PropTypes.number,
};

Atlas.defaultProps = {
  viewer: false,
  disabledLayers: [],
  activeBasemap: null,
  selectedFeature: null,
  opacity: 1,
};

export default Atlas;
