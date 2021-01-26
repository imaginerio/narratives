import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation, gql } from '@apollo/client';
import { pick } from 'lodash';

import Atlas from './index';

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
      disabledLayers: layers {
        id
        layerId
      }
      basemap {
        id
        ssid
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
  const updateViewport = newViewport => {
    clearTimeout(viewportTimer.current);
    viewportTimer.current = setTimeout(() => {
      onUpdateViewport({
        variables: {
          slide,
          ...newViewport,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateSlide: {
            __typename: 'Slide',
            id: slide,
            ...newViewport,
          },
        },
      });
    }, 500);
  };

  const [mapViewport, setMapViewport] = useState(null);

  useEffect(() => {
    setMapViewport(
      data ? pick(data.Slide, ['longitude', 'latitude', 'zoom', 'bearing', 'pitch']) : null
    );
  }, [loading, data]);

  const onViewportChange = nextViewport => {
    if (nextViewport) {
      setMapViewport(nextViewport);
      updateViewport(nextViewport);
    }
  };

  if (loading || !mapViewport) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Atlas
      handler={onViewportChange}
      viewport={mapViewport}
      year={data.Slide.year}
      disabledLayers={data.Slide.disabledLayers}
      activeBasemap={data.Slide.activeBasemap}
      selectedFeature={data.Slide.selectedFeature}
      opacity={data.Slide.opacity}
    />
  );
};

AtlasContext.propTypes = {
  slide: PropTypes.string.isRequired,
};

export default AtlasContext;
