import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/client';
import { Modal, Button, Item, Icon, Label } from 'semantic-ui-react';
import { Slider } from 'react-semantic-ui-range';

import debouncedMutation from '../../lib/debouncedMutation';
import { GET_SLIDE, GET_BASEMAPS, UPDATE_BASEMAP, UPDATE_SLIDE_OPACITY } from './graphql';

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
      <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        trigger={<Button>Show Modal</Button>}
      >
        <Modal.Header>Select a Basemap</Modal.Header>
        <Modal.Content scrolling>
          <Item.Group divided>
            {options.map(basemap => (
              <Item key={basemap.ssid} onClick={() => setActiveBasemap(basemap)}>
                <Item.Image size="small" src={basemap.thumbnail} />
                <Item.Content>
                  <Item.Header>{basemap.title}</Item.Header>
                  <Item.Description>
                    {basemap.creator && (
                      <p>
                        <b>Creator: </b>
                        {basemap.creator}
                      </p>
                    )}
                    <p>
                      <b>First year: </b>
                      {basemap.firstYear}
                    </p>
                    <p>
                      <b>Last year: </b>
                      {basemap.lastYear}
                    </p>
                  </Item.Description>
                </Item.Content>
              </Item>
            ))}
          </Item.Group>
        </Modal.Content>
      </Modal>
      {activeBasemap && (
        <Label style={{ maxWidth: '100%' }}>
          <div
            style={{
              display: 'inline-block',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              width: 'calc(100% - 20px)',
            }}
          >
            {activeBasemap.title}
          </div>
          <Icon name="delete" />
        </Label>
      )}
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
