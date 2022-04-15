import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation, gql } from '@apollo/client';
import { some, pick, isEqual } from 'lodash';
import { Segment, Form, Button, Icon } from 'semantic-ui-react';

import Basemaps from '../Basemaps';
import useLocale from '../../hooks/useLocale';

import styles from './Layers.module.css';

const GET_SLIDE = gql`
  query GetSlide($slide: ID!) {
    Slide(where: { id: $slide }) {
      id
      disabledLayers: layers {
        id
        layerId
      }
    }
  }
`;

const GET_LAYERS = gql`
  query {
    layers: allLayers(orderBy: "title_ASC") {
      id
      layerId
      title
      remoteId
    }
  }
`;

const UPDATE_LAYERS = gql`
  mutation UpdateLayers($slide: ID!, $layers: LayerRelateToManyInput) {
    updateSlide(id: $slide, data: { layers: $layers }) {
      id
      layers {
        id
        layerId
      }
    }
  }
`;

const Layers = ({ slide }) => {
  const { data } = useQuery(GET_SLIDE, {
    variables: { slide },
  });
  const allLayers = useQuery(GET_LAYERS);
  const [updateLayers] = useMutation(UPDATE_LAYERS);

  const onLayersChange = newLayers => {
    updateLayers({
      variables: {
        slide,
        layers: {
          connect: newLayers.map(nl => ({ id: nl.id })),
          disconnectAll: true,
        },
      },
      optimisticResponse: {
        __typename: 'Mutation',
        updateSlide: {
          __typename: 'Slide',
          id: slide,
          layers: newLayers.map(l => ({
            __typename: 'Layer',
            ...pick(l, 'id', 'layerId'),
          })),
        },
      },
    });
  };

  const [disabledLayers, setDisabledLayers] = useState([]);
  const [open, setOpen] = useState(false);

  const { layers } = useLocale();

  useEffect(() => {
    if (data) {
      setDisabledLayers(data.Slide.disabledLayers);
    }
  }, [data]);

  useEffect(() => {
    if (data && !isEqual(disabledLayers, data.Slide.disabledLayers)) onLayersChange(disabledLayers);
  }, [disabledLayers]);

  return (
    <>
      <Button
        icon="clone outline"
        onClick={() => setOpen(!open)}
        style={{ display: 'inline-block' }}
      />
      {open && (
        <Segment className={styles.layerMenu}>
          <Icon
            style={{ float: 'right', cursor: 'pointer' }}
            name="close"
            onClick={() => setOpen(false)}
          />
          <Basemaps slide={slide} />
          <Form.Group style={{ borderTop: '1px solid #ccc', marginTop: 15, paddingTop: 15 }}>
            <h3 style={{ marginTop: 0 }}>{layers}</h3>
            {allLayers.data.layers.map(layer => (
              <Form.Field
                className={styles.layerCheck}
                key={layer.id}
                label={layer.title}
                control="input"
                type="checkbox"
                value={layer.id}
                checked={!some(disabledLayers, nl => nl.id === layer.id)}
                onChange={e => {
                  const { value, checked } = e.target;
                  if (checked) {
                    return setDisabledLayers(disabledLayers.filter(nl => nl.id !== value));
                  }
                  return setDisabledLayers([
                    ...disabledLayers,
                    allLayers.data.layers.find(l => l.id === value),
                  ]);
                }}
              />
            ))}
          </Form.Group>
        </Segment>
      )}
    </>
  );
};

Layers.propTypes = {
  slide: PropTypes.string.isRequired,
};

export default Layers;
