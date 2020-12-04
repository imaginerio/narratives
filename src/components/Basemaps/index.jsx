import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import { Slider } from 'react-semantic-ui-range';

const Basemaps = ({ activeBasemap, basemaps, basemapHandler, opacityHandler, opacity }) => {
  const [newBasemap, setNewBasemap] = useState(activeBasemap ? activeBasemap.id : null);
  useEffect(() => {
    const active = basemaps.find(b => b.id === newBasemap);
    basemapHandler(active);
  }, [newBasemap]);
  return (
    <div>
      <Dropdown
        placeholder="Select overlay"
        fluid
        selection
        clearable
        value={newBasemap}
        options={basemaps.map(b => ({ value: b.id, text: b.title }))}
        onChange={(e, { value }) => setNewBasemap(value)}
      />
      <Slider
        discrete
        inverted={false}
        settings={{
          start: opacity,
          min: 0,
          max: 1,
          step: 0.1,
          onChange: opacityHandler,
        }}
      />
    </div>
  );
};

Basemaps.propTypes = {
  activeBasemap: PropTypes.shape(),
  basemaps: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  basemapHandler: PropTypes.func.isRequired,
  opacityHandler: PropTypes.func.isRequired,
  opacity: PropTypes.number,
};

Basemaps.defaultProps = {
  activeBasemap: null,
  opacity: 1,
};

export default Basemaps;
