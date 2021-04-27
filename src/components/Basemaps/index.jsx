import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/client';
import { Button, Segment } from 'semantic-ui-react';
import { Slider } from 'react-semantic-ui-range';

import debouncedMutation from '../../lib/debouncedMutation';
import { GET_SLIDE, GET_BASEMAPS, UPDATE_BASEMAP, UPDATE_SLIDE_OPACITY } from './graphql';
import Chooser from './Chooser';
import styles from './Basemaps.module.css';

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
        connect: { id: newBasemap.id },
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
              ...newBasemap,
            },
          },
        },
      },
    });
  };

  const opacityTimer = useRef();

  const [options, setOptions] = useState([]);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (allBasemaps && allBasemaps.data) {
      const { year } = data.Slide;
      setOptions(allBasemaps.data.basemaps.filter(b => b.firstYear <= year && b.lastYear >= year));
    }
  }, [allBasemaps, data]);

  useEffect(() => {
    opacityTimer.current = debouncedMutation({
      slide,
      timerRef: opacityTimer,
      mutation: updateOpacity,
      values: { opacity },
    });
  }, [opacity]);

  useEffect(() => {
    if (data) {
      setOpacity(data.Slide.opacity);
    }
  }, [allBasemaps.loading, data]);

  return (
    <div>
      <h3 style={{ marginTop: 0 }}>Maps / Plans / Aerials</h3>
      {data && data.Slide.basemap ? (
        <Segment style={{ padding: '0.5em', display: 'flex', alignItems: 'center' }}>
          <div
            className={styles.thumbnail}
            style={{
              backgroundImage: `url(${data.Slide.basemap.thumbnail})`,
            }}
          />
          <div style={{ width: 'calc(100% - 60px)' }}>{data.Slide.basemap.title}</div>
          <Button
            className={styles.closeButton}
            circular
            icon="close"
            size="mini"
            onClick={() => onBasemapChange(null)}
          />
        </Segment>
      ) : (
        <Chooser options={options} handler={onBasemapChange} />
      )}
      <h4>Overlay Opacity</h4>
      <Slider
        disabled={!data || !data.Slide.basemap}
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
