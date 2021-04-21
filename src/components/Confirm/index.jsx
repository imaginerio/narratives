import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Header as Heading, Button, Modal, Icon } from 'semantic-ui-react';

const Confirm = ({ disabled, buttonIcon, buttonTitle, confirmTitle, confirmHandler, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <Modal
      basic
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size="small"
      trigger={
        // eslint-disable-next-line react/jsx-wrap-multilines
        <Button
          negative
          fluid
          labelPosition="left"
          icon={buttonIcon}
          content={buttonTitle}
          disabled={disabled}
        />
      }
    >
      <Heading icon>
        <Icon name={buttonIcon} />
        {confirmTitle}
      </Heading>
      <Modal.Content>{children}</Modal.Content>
      <Modal.Actions>
        <Button basic color="red" inverted onClick={() => setOpen(false)}>
          <Icon name="remove" />
          <span>No</span>
        </Button>
        <Button
          negative
          inverted
          onClick={() => {
            setOpen(false);
            confirmHandler();
          }}
        >
          <Icon name={buttonIcon} />
          <span>Yes</span>
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

Confirm.propTypes = {
  disabled: PropTypes.bool,
  buttonIcon: PropTypes.string,
  buttonTitle: PropTypes.string.isRequired,
  confirmHandler: PropTypes.func.isRequired,
  confirmTitle: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

Confirm.defaultProps = {
  disabled: false,
  buttonIcon: null,
  confirmTitle: null,
};

export default Confirm;
