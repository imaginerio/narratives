import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Dropdown } from 'semantic-ui-react';
import { Slider } from 'react-semantic-ui-range';

const GET_SLIDE = gql`
  query GetBasemap($slide: ID!) {
    Slide(where: { id: $slide }) {
      id
      year
      opacity
      basemap {
        id
        ssid
      }
    }
  }
`;

const GET_BASEMAPS = gql`
  query {
    basemaps: allBasemaps {
      id
      ssid
      title
      firstYear
      lastYear
    }
  }
`;

const UPDATE_BASEMAP = gql`
  mutation UpdateBasemap($slide: ID!, $basemap: BasemapRelateToOneInput) {
    updateSlide(id: $slide, data: { basemap: $basemap }) {
      id
      basemap {
        id
      }
    }
  }
`;

const UPDATE_SLIDE_OPACITY = gql`
  mutation UpdateSlideTitle($slide: ID!, $value: Float) {
    updateSlide(id: $slide, data: { opacity: $value }) {
      id
      opacity
    }
  }
`;

const Basemaps = ({ slide }) => {
  const { data } = useQuery(GET_SLIDE, {
    variables: { slide },
  });
  const allBasemaps = useQuery(GET_BASEMAPS);
  const [updateBasemap] = useMutation(UPDATE_BASEMAP);
  const [updateOpacity] = useMutation(UPDATE_SLIDE_OPACITY);

  const onBasemapChange = newBasemap => {
    let basemap = { disconnectAll: true };
    if (newBasemap) {
      basemap = {
        connect: { id: newBasemap },
      };
    }
    updateBasemap({
      variables: {
        slide,
        basemap,
        optimisticResponse: {
          __typename: 'Mutation',
          updateSlide: {
            __typename: 'Slide',
            id: slide,
            basemap: {
              __typename: 'Basemap',
              id: newBasemap,
            },
          },
        },
      },
    });
  };

  const opacityTimer = useRef();
  const onOpacityChange = newOpacity => {
    clearTimeout(opacityTimer.current);
    opacityTimer.current = setTimeout(() => {
      updateOpacity({
        variables: {
          slide,
          value: newOpacity,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateSlide: {
            __typename: 'Slide',
            id: slide,
            opacity: newOpacity,
          },
        },
      });
    }, 500);
  };

  const [year, setYear] = useState(1900);
  const [activeBasemap, setActiveBasemap] = useState(null);
  const [options, setOptions] = useState([]);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (allBasemaps && allBasemaps.data) {
      setOptions(
        allBasemaps.data.basemaps
          .filter(b => b.firstYear <= year && b.lastYear >= year)
          .map(b => ({ value: b.id, text: b.title }))
      );
    }
  }, [year, allBasemaps]);

  useEffect(() => {
    onBasemapChange(activeBasemap);
  }, [activeBasemap]);

  useEffect(() => {
    onOpacityChange(opacity);
  }, [opacity, activeBasemap]);

  useEffect(() => {
    if (data) {
      if (data.Slide.year !== year) setYear(data.Slide.year);
      if (data.Slide.basemap) setActiveBasemap(data.Slide.basemap.id);
      setOpacity(data.Slide.opacity);
    }
  }, [allBasemaps.loading, data]);

  return (
    <div>
      <h3 style={{ marginTop: 0 }}>Maps / Plans / Aerials</h3>
      <Dropdown
        loading={allBasemaps.loading}
        placeholder="Select overlay"
        fluid
        selection
        clearable
        value={activeBasemap}
        options={options}
        onChange={(e, { value }) => setActiveBasemap(value)}
      />
      <h3>Overlay Opacity</h3>
      <Slider
        discrete
        inverted={false}
        value={opacity}
        settings={{
          min: 0,
          max: 1,
          step: 0.1,
          onChange: setOpacity,
        }}
      />
    </div>
  );
};

Basemaps.propTypes = {
  slide: PropTypes.string.isRequired,
};

export default Basemaps;
