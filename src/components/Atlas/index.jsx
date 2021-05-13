/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ReactMapGL, {
  Source,
  Layer,
  NavigationControl,
  AttributionControl,
  LinearInterpolator,
} from 'react-map-gl';
import axios from 'axios';
import { map as mapProp } from 'lodash';
import { Icon } from 'semantic-ui-react';
import { Editor } from 'react-map-gl-draw';

import { useDraw } from '../../providers/DrawProvider';
import Toolbar from '../Toolbar';

import { minZoom, maxZoom } from '../../config/map';
import styles from './Atlas.module.css';

const Atlas = ({
  handler,
  viewport,
  year,
  viewer,
  disabledLayers,
  selectedFeature,
  activeBasemap,
  opacity,
  annotations,
}) => {
  const mapRef = useRef(null);

  let drawProps = [];
  if (!viewer) [drawProps] = useDraw();
  const [mapViewport, setMapViewport] = useState(viewport);
  const [featureData, setFeatureData] = useState(null);
  const [is2D, setIs2D] = useState(true);
  const [locked, setLocked] = useState(false);

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
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SEARCH_API}/feature/${selectedFeature}?year=${year}`
      );
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
      minZoom,
      maxZoom,
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
      };
      if (!locked) {
        props.onViewportChange = handler;
      }
    }
    return props;
  };

  return (
    <ReactMapGL {...getMapProps()}>
      {drawProps.editing && <Editor {...drawProps} />}
      {!viewer && <Toolbar />}
      {activeBasemap && (
        <>
          <AttributionControl
            style={{ right: 0, bottom: 0 }}
            customAttribution={`${activeBasemap.title} - ${activeBasemap.creator}`}
          />
          <Source
            key={activeBasemap.ssid}
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
        </>
      )}
      {selectedFeature && (
        <Source key={selectedFeature} type="geojson" data={featureData}>
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
      {!drawProps.editing && annotations && (
        <Source type="geojson" data={annotations}>
          <Layer id="annotation-polygon" type="fill" filter={['==', '$type', 'Polygon']} />
          <Layer id="annotation-line" type="line" filter={['==', '$type', 'LineString']} />
          <Layer id="annotation-point" type="circle" filter={['==', '$type', 'Point']} />
          <Layer
            id="annotation-polygon-label"
            type="symbol"
            filter={['==', '$type', 'Polygon']}
            layout={{ 'text-field': ['get', 'title'], 'symbol-placement': 'line-center' }}
            paint={{ 'text-halo-width': 3, 'text-halo-color': '#FFFFFF' }}
          />
          <Layer
            id="annotation-line-label"
            type="symbol"
            filter={['==', '$type', 'LineString']}
            layout={{ 'text-field': ['get', 'title'], 'symbol-placement': 'line' }}
            paint={{ 'text-halo-width': 3, 'text-halo-color': '#FFFFFF' }}
          />
          <Layer
            id="annotation-point-label"
            type="symbol"
            filter={['==', '$type', 'Point']}
            layout={{
              'text-field': ['get', 'title'],
              'text-variable-anchor': ['bottom-left', 'top-left', 'bottom-right', 'top-right'],
            }}
            paint={{ 'text-halo-width': 3, 'text-halo-color': '#FFFFFF' }}
          />
        </Source>
      )}
      {!viewer && (
        <div style={{ position: 'absolute', left: 15, top: 100 }}>
          <NavigationControl showCompass={false} />
          <div
            className={`${styles.button} ${styles.button2D}`}
            role="button"
            tabIndex={-1}
            onClick={() => {
              const pitch = is2D ? 60 : 0;
              setIs2D(!is2D);
              onViewportChange({
                ...viewport,
                pitch,
                transitionInterpolator: new LinearInterpolator(['pitch']),
                transitionDuration: 500,
              });
            }}
          >
            {is2D ? '3D' : '2D'}
          </div>
          <div
            className={`${styles.button} ${styles.buttonLock}`}
            role="button"
            tabIndex={-1}
            onClick={() => setLocked(!locked)}
          >
            {locked ? <Icon name="lock" /> : <Icon name="lock open" />}
          </div>
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
  annotations: PropTypes.shape(),
};

Atlas.defaultProps = {
  viewer: false,
  disabledLayers: [],
  activeBasemap: null,
  selectedFeature: null,
  opacity: 1,
  annotations: null,
};

export default Atlas;
