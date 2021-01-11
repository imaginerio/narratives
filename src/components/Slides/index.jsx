import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';

import Slide from '../Slide';

import styles from './Slides.module.css';

const Slides = ({ slides, active, handler }) => {
  const [cards, setCards] = useState(slides);
  const moveCard = useCallback(
    (dragIndex, hoverIndex) => {
      const dragCard = cards[dragIndex];
      setCards(
        update(cards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragCard],
          ],
        })
      );
    },
    [slides]
  );

  return (
    <div className={styles.slides}>
      {cards.map(slide => {
        const color = slide.id === active ? { color: 'blue' } : {};
        return (
          <Slide
            key={slide.id}
            id={slide.id}
            title={slide.title}
            index={slide.order}
            color={color}
            moveCard={moveCard}
            handler={handler}
          />
        );
      })}
    </div>
  );
};

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
