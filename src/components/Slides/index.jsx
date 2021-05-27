import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import { sortBy } from 'lodash';

import Slide from '../Slide';

import styles from './Slides.module.css';

const Slides = ({ slides, active, handler, onUpdate, duplicate, newSlide }) => {
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
    [cards]
  );

  useEffect(() => {
    const data = cards.map((c, i) => ({
      id: c.id,
      data: {
        title: c.title,
        order: i + 1,
      },
    }));
    onUpdate(data);
  }, [cards]);

  useEffect(() => {
    setCards(sortBy(slides, s => s.order));
  }, [slides]);

  return (
    <div className={styles.slides}>
      {cards.map(({ id, title }, i) => (
        <Slide
          key={id}
          id={id}
          title={title}
          index={i}
          color={id === active ? 'blue' : ''}
          moveCard={moveCard}
          handler={handler}
          duplicate={duplicate}
          newSlide={newSlide}
        />
      ))}
    </div>
  );
};

Slides.propTypes = {
  slides: PropTypes.arrayOf(PropTypes.shape()),
  active: PropTypes.string,
  handler: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  duplicate: PropTypes.func.isRequired,
  newSlide: PropTypes.func.isRequired,
};

Slides.defaultProps = {
  slides: [],
  active: '[Card title]',
};

export default Slides;
