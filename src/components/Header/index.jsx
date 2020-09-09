import React from 'react';
import { Button } from 'semantic-ui-react';

const Header = ({ handler }) => (
  <Button onClick={handler} content="Add Card" icon="plus" labelPosition="left" />
);

export default Header;
