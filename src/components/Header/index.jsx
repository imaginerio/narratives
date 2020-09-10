import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

const Header = ({ handler }) => (
  <Button onClick={handler} content="Add Card" icon="plus" labelPosition="left" />
);

Header.propTypes = {
  handler: PropTypes.func.isRequired,
};

export default Header;
