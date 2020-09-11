import React from 'react';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';

import styles from './Slides.module.css';

const Slides = ({ slides, active, handler }) => (
  <div className={styles.slides}>
    {slides.map((slide, i) => {
      const color = slide.id === active ? { color: 'blue' } : {};
      return (
        <Segment
          key={slide.id}
          className={styles.slide}
          {...color}
          onClick={() => handler(slide.id)}
        >
          <div className={styles.slideTitle}>{slide.title}</div>
          <div className={styles.slideNumber}>{i}</div>
        </Segment>
      );
    })}
  </div>
);

Slides.propTypes = {
  slides: PropTypes.arrayOf(PropTypes.shape()),
  active: PropTypes.string,
  handler: PropTypes.func.isRequired,
};

Slides.defaultProps = {
  slides: [],
  active: '[Card title]',
};

export default Slides;
