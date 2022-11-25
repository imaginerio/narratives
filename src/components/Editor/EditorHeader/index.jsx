import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { Button } from 'semantic-ui-react';

import useLocale from '../../../hooks/useLocale';

import styles from './EditorHeader.module.css';

const EditorHeader = ({ title, project }) => {
  const { locale } = useRouter();
  const { myNarratives, launchPreview } = useLocale();
  return (
    <div className={styles.header}>
      <a className={styles.projectLink} href={`/${locale}/projects`}>
        {myNarratives}
      </a>
      <Button
        primary
        className={styles.headerButton}
        content={launchPreview}
        icon="play"
        labelPosition="left"
        as="a"
        href={`/${locale}/preview/${project}`}
        target="_blank"
      />
      <div className={styles.title}>{title}</div>
    </div>
  );
};

EditorHeader.propTypes = {
  title: PropTypes.string,
  project: PropTypes.string.isRequired,
};

EditorHeader.defaultProps = {
  title: null,
};

export default EditorHeader;
