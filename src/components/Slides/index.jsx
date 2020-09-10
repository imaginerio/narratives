import React from 'react';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';

const Slides = ({ slides, active, handler }) => (
  <>
    {slides.map((slide, i) => (
      <Segment
        key={slide.id}
        color={slide.id === active ? 'blue' : 'grey'}
        onClick={() => handler(slide.id)}
      >
        {i}
      </Segment>
    ))}
  </>
);

Slides.propTypes = {
  slides: PropTypes.arrayOf(PropTypes.shape()),
  active: PropTypes.string,
  handler: PropTypes.func.isRequired,
};

Slides.defaultProps = {
  slides: [],
  active: null,
};

export default Slides;
