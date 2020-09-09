import React from 'react';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';

const Slides = ({ slides, active }) => (
  <>
    {slides.map((slide, i) => (
      <Segment key={`slide${i}`} color={i === active ? 'blue' : 'grey'}>
        {i}
      </Segment>
    ))}
  </>
);

Slides.propTypes = {
  slides: PropTypes.arrayOf(PropTypes.shape()),
  active: PropTypes.number,
};

Slides.defaultProps = {
  slides: [],
  active: 0,
};

export default Slides;
