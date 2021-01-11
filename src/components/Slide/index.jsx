import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useDrag, useDrop } from 'react-dnd';
import { Segment } from 'semantic-ui-react';

import ItemTypes from './ItemTypes';

import styles from './Slide.module.css';

const Slide = ({ id, title, index, color, moveCard, handler }) => {
  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: ItemTypes.SLIDE,
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveCard(dragIndex, hoverIndex);
      // eslint-disable-next-line no-param-reassign
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    item: {
      type: ItemTypes.SLIDE,
      id,
      index,
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  return (
    <div ref={ref} style={{ opacity }} onClick={handler}>
      <Segment className={styles.slide} {...color}>
        <div className={styles.slideTitle}>{title}</div>
        <div className={styles.slideNumber}>{index}</div>
      </Segment>
    </div>
  );
};

Slide.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  index: PropTypes.number.isRequired,
  color: PropTypes.shape({ color: PropTypes.string }),
  moveCard: PropTypes.func.isRequired,
  handler: PropTypes.func.isRequired,
};

Slide.defaultProps = {
  title: '',
  color: {},
};

export default Slide;
