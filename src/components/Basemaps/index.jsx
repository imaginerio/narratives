import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/client';
import { Modal, Button, Segment, Item } from 'semantic-ui-react';
import { Slider } from 'react-semantic-ui-range';

import debouncedMutation from '../../lib/debouncedMutation';
import { GET_SLIDE, GET_BASEMAPS, UPDATE_BASEMAP, UPDATE_SLIDE_OPACITY } from './graphql';
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

  const [year, setYear] = useState(1900);
  const [activeBasemap, setActiveBasemap] = useState(null);
  const [options, setOptions] = useState([]);
  const [opacity, setOpacity] = useState(1);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (allBasemaps && allBasemaps.data) {
      setOptions(allBasemaps.data.basemaps.filter(b => b.firstYear <= year && b.lastYear >= year));
    }
  }, [year, allBasemaps]);

  useEffect(() => {
    onBasemapChange(activeBasemap);
    setOpen(false);
  }, [activeBasemap]);

  useEffect(() => {
    opacityTimer.current = debouncedMutation({
      slide,
      timerRef: opacityTimer,
      mutation: updateOpacity,
      values: { opacity },
    });
  }, [opacity, activeBasemap]);

  useEffect(() => {
    if (data) {
      if (data.Slide.year !== year) setYear(data.Slide.year);
      if (data.Slide.basemap) setActiveBasemap(data.Slide.basemap);
      setOpacity(data.Slide.opacity);
    }
  }, [allBasemaps.loading, data]);

  return (
    <div>
      <h3 style={{ marginTop: 0 }}>Maps / Plans / Aerials</h3>
      {activeBasemap ? (
        <Segment style={{ padding: '0.5em', display: 'flex', alignItems: 'center' }}>
          <div
            className={styles.thumbnail}
            style={{
              backgroundImage: `url(${activeBasemap.thumbnail})`,
            }}
          />
          <div style={{ width: 'calc(100% - 60px)' }}>{activeBasemap.title}</div>
          <Button
            className={styles.closeButton}
            circular
            icon="close"
            size="mini"
            onClick={() => setActiveBasemap(null)}
          />
        </Segment>
      ) : (
        <>
          {options.length ? (
            <Modal
              closeIcon
              onClose={() => setOpen(false)}
              onOpen={() => setOpen(true)}
              open={open}
              trigger={
                <Button fluid content="Select Basemap" icon="map outline" labelPosition="left" />
              }
            >
              <Modal.Header>Select a Basemap</Modal.Header>
              <Modal.Content scrolling>
                <Item.Group divided link>
                  {options.map(basemap => (
                    <Item key={basemap.ssid} onClick={() => setActiveBasemap(basemap)}>
                      <Item.Image size="tiny" src={basemap.thumbnail} />
                      <Item.Content>
                        <Item.Header style={{ fontSize: 16 }}>{basemap.title}</Item.Header>
                        <Item.Description style={{ marginTop: 0 }}>
                          {basemap.creator}
                        </Item.Description>
                      </Item.Content>
                    </Item>
                  ))}
                </Item.Group>
              </Modal.Content>
            </Modal>
          ) : (
            <i>No basemaps available for the selected year</i>
          )}
        </>
      )}
      <h4>Overlay Opacity</h4>
      <Slider
        disabled={!activeBasemap}
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
