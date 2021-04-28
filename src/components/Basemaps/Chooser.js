import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Item } from 'semantic-ui-react';

const Chooser = ({ options, handler }) => {
  const [open, setOpen] = useState(false);

  if (options.length === 0) return <i>No basemaps available for the selected year</i>;

  return (
    <Modal
      closeIcon
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button fluid content="Select Basemap" icon="map outline" labelPosition="left" />}
    >
      <Modal.Header>Select a Basemap</Modal.Header>
      <Modal.Content scrolling>
        <Item.Group divided link>
          {options.map(basemap => (
            <Item
              key={basemap.ssid}
              onClick={() => {
                handler(basemap);
                setOpen(false);
              }}
            >
              <Item.Image size="tiny" src={basemap.thumbnail} />
              <Item.Content>
                <Item.Header style={{ fontSize: 16 }}>{basemap.title}</Item.Header>
                <Item.Description style={{ marginTop: 0 }}>{basemap.creator}</Item.Description>
              </Item.Content>
            </Item>
          ))}
        </Item.Group>
      </Modal.Content>
    </Modal>
  );
};

Chooser.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  handler: PropTypes.func.isRequired,
};

Chooser.defaultProps = {};

export default Chooser;
