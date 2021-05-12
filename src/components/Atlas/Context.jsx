import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation, gql } from '@apollo/client';
import { pick, isEqual } from 'lodash';
import { Dimmer, Loader } from 'semantic-ui-react';

import Atlas from './index';
import { minZoom, maxZoom, minLon, maxLon, minLat, maxLat } from '../../config/map';
import debouncedMutation from '../../providers/debouncedMutation';

const GET_SLIDE_ATLAS = gql`
  query GetSlideYear($slide: ID!) {
    Slide(where: { id: $slide }) {
      id
      year
      longitude
      latitude
      zoom
      bearing
      pitch
      selectedFeature
      opacity
      annotations {
        id
        feature
      }
      disabledLayers: layers {
        id
        layerId
      }
      basemap {
        id
        ssid
        title
        thumbnail
        creator
      }
    }
  }
`;

const UPDATE_VIEWPORT = gql`
  mutation UpdateViewport(
    $slide: ID!
    $longitude: Float
    $latitude: Float
    $zoom: Float
    $bearing: Float
    $pitch: Float
  ) {
    updateSlide(
      id: $slide
      data: {
        longitude: $longitude
        latitude: $latitude
        zoom: $zoom
        bearing: $bearing
        pitch: $pitch
      }
    ) {
      id
      longitude
      latitude
      zoom
      bearing
      pitch
    }
  }
`;

const AtlasContext = ({ slide }) => {
  const { loading, error, data } = useQuery(GET_SLIDE_ATLAS, {
    variables: { slide },
  });

  const [onUpdateViewport] = useMutation(UPDATE_VIEWPORT);
  const viewportTimer = useRef();

  const [mapViewport, setMapViewport] = useState(null);
  const [annotations, setAnnotations] = useState(null);

  useEffect(() => {
    if (data) {
      setMapViewport(pick(data.Slide, ['longitude', 'latitude', 'zoom', 'bearing', 'pitch']));
      if (data.Slide.annotations) {
        setAnnotations({
          type: 'FeatureCollection',
          features: data.Slide.annotations.map(({ feature }) => JSON.parse(feature)),
        });
      }
    }
  }, [loading, data]);

  const onViewportChange = nextViewport => {
    if (nextViewport) {
      const clampedPort = {
        ...nextViewport,
        longitude: Math.max(minLon, Math.min(maxLon, nextViewport.longitude)),
        latitude: Math.max(minLat, Math.min(maxLat, nextViewport.latitude)),
        zoom: Math.max(minZoom, Math.min(maxZoom, nextViewport.zoom)),
      };
      setMapViewport(clampedPort);
      if (
        !isEqual(
          clampedPort,
          pick(data.Slide, ['longitude', 'latitude', 'zoom', 'bearing', 'pitch'])
        )
      ) {
        viewportTimer.current = debouncedMutation({
          slide,
          timerRef: viewportTimer,
          mutation: onUpdateViewport,
          values: clampedPort,
        });
      }
    }
  };

  if (loading || !mapViewport || !data)
    return (
      <Dimmer active>
        <Loader size="huge">Loading</Loader>
      </Dimmer>
    );
  if (error) return <p>Error :(</p>;

  return (
    <Atlas
      handler={onViewportChange}
      viewport={mapViewport}
      year={data.Slide.year}
      disabledLayers={data.Slide.disabledLayers}
      activeBasemap={data.Slide.basemap}
      selectedFeature={data.Slide.selectedFeature}
      opacity={data.Slide.opacity}
      annotations={annotations}
    />
  );
};

AtlasContext.propTypes = {
  slide: PropTypes.string.isRequired,
};

export default AtlasContext;
