import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import { Slider } from 'react-semantic-ui-range';

const Basemaps = ({ activeBasemap, basemaps, basemapHandler, opacityHandler, opacity, year }) => {
  const [newBasemap, setNewBasemap] = useState(activeBasemap ? activeBasemap.id : null);
  const [options, setOptions] = useState(
    basemaps
      .filter(b => b.firstYear <= year && b.lastYear >= year)
      .map(b => ({ value: b.id, text: b.title }))
  );

  useEffect(() => {
    const active = basemaps.find(b => b.id === newBasemap);
    basemapHandler(active);
  }, [newBasemap]);

  useEffect(() => {
    setOptions(
      basemaps
        .filter(b => b.firstYear <= year && b.lastYear >= year)
        .map(b => ({ value: b.id, text: b.title }))
    );
  }, [year]);

  return (
    <div>
      <Dropdown
        placeholder="Select overlay"
        fluid
        selection
        clearable
        value={newBasemap}
        options={options}
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
  year: PropTypes.number.isRequired,
};

Basemaps.defaultProps = {
  activeBasemap: null,
  opacity: 1,
};

export default Basemaps;
