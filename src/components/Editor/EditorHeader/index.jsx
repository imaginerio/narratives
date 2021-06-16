import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

import styles from './EditorHeader.module.css';

const EditorHeader = ({ title, project }) => (
  <div className={styles.header}>
    <a className={styles.projectLink} href="/projects">
      My Narratives
    </a>
    <Button
      primary
      className={styles.headerButton}
      content="Launch Preview"
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
  title: PropTypes.string,
  project: PropTypes.string.isRequired,
};

EditorHeader.defaultProps = {
  title: null,
};

export default EditorHeader;
