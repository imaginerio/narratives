import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { some } from 'lodash';
import { Segment, Form, Button, Icon } from 'semantic-ui-react';

import Basemaps from '../Basemaps';

import styles from './Layers.module.css';

const Layers = ({
  layers,
  year,
  basemaps,
  disabledLayers,
  activeBasemap,
  layerHandler,
  basemapHandler,
  opacityHandler,
  opacity,
}) => {
  const [open, setOpen] = useState(false);
  const [newLayers, setNewLayers] = useState(disabledLayers);

  useEffect(() => layerHandler(newLayers), [newLayers]);

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
          <h3 style={{ marginTop: 0 }}>Layers</h3>
          <Basemaps
            basemaps={basemaps}
            basemapHandler={basemapHandler}
            activeBasemap={activeBasemap}
            opacityHandler={opacityHandler}
            opacity={opacity}
            year={year}
          />
          <Form.Group>
            {layers.map(layer => (
              <Form.Field
                className={styles.layerCheck}
                key={layer.id}
                label={layer.title}
                control="input"
                type="checkbox"
                value={layer.id}
                checked={!some(newLayers, nl => nl.id === layer.id)}
                onChange={e => {
                  const { value, checked } = e.target;
                  if (checked) {
                    return setNewLayers(newLayers.filter(nl => nl.id !== value));
                  }
                  return setNewLayers([...newLayers, layers.find(l => l.id === value)]);
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
  layers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  basemaps: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  disabledLayers: PropTypes.arrayOf(PropTypes.string),
  activeBasemap: PropTypes.shape(),
  layerHandler: PropTypes.func.isRequired,
  basemapHandler: PropTypes.func.isRequired,
  opacityHandler: PropTypes.func.isRequired,
  opacity: PropTypes.number,
  year: PropTypes.number.isRequired,
};

Layers.defaultProps = {
  disabledLayers: [],
  activeBasemap: null,
  opacity: 1,
};

export default Layers;
