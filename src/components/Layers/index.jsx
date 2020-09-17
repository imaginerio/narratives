import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { some } from 'lodash';
import { Form, Button } from 'semantic-ui-react';

const Layers = ({ layers, disabledLayers, layerHandler }) => {
  const [open, setOpen] = useState(false);
  const [newLayers, setNewLayers] = useState(disabledLayers);

  useEffect(() => layerHandler(newLayers), [newLayers]);

  return (
    <>
      <Button icon="clone outline" floated="right" onClick={() => setOpen(!open)} />
      {open && (
        <Form.Group>
          {layers.map(layer => (
            <Form.Field
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
      )}
    </>
  );
};

Layers.propTypes = {
  layers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  disabledLayers: PropTypes.arrayOf(PropTypes.string),
  layerHandler: PropTypes.func.isRequired,
};

Layers.defaultProps = {
  disabledLayers: [],
};

export default Layers;
