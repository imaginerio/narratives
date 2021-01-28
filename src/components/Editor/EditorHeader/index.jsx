import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

import styles from './EditorHeader.module.css';

const EditorHeader = ({ handler, title, project }) => (
  <div className={styles.header}>
    <a className={styles.projectLink} href="/projects">
      My Narratives
    </a>
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
      content="Preview"
      icon="play"
      labelPosition="left"
      as="a"
      href={`/preview/${project}`}
      target="_blank"
    />
    <div className={styles.title}>{title}</div>
  </div>
);

EditorHeader.propTypes = {
  handler: PropTypes.func.isRequired,
  title: PropTypes.string,
  project: PropTypes.string.isRequired,
};

EditorHeader.defaultProps = {
  title: null,
};

export default EditorHeader;
