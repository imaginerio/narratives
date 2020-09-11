import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

import styles from './Header.module.css';

const Header = ({ handler, title }) => (
  <div className={styles.header}>
    <Button
      className={styles.headerButton}
      onClick={handler}
      content="Add Card"
      icon="plus"
      labelPosition="left"
      color="blue"
    />
    <Button
      className={styles.headerButton}
      onClick={handler}
      content="Preview"
      icon="play"
      labelPosition="left"
    />
    <div className={styles.title}>{title}</div>
  </div>
);

Header.propTypes = {
  handler: PropTypes.func.isRequired,
  title: PropTypes.string,
};

Header.defaultProps = {
  title: null,
};

export default Header;
