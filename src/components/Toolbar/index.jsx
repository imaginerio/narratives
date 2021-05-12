import React from 'react';

import { useDraw } from '../../providers/DrawProvider';
import styles from './Toolbar.module.css';

export default function Toolbar() {
  const [, dispatch] = useDraw();
  return (
    <div
      style={{ position: 'absolute', left: 15, top: 235, display: 'flex', flexDirection: 'column' }}
    >
      <button
        className={`${styles.button} `}
        type="button"
        tabIndex={-1}
        id="toolbar"
        onClick={() => dispatch(['SET_MODE', 'drawPolyline'])}
      >
        <img src="/img/line.svg" alt="Draw line" />
      </button>
      <button
        className={`${styles.button} `}
        type="button"
        tabIndex={-1}
        id="toolbar"
        onClick={() => dispatch(['SET_MODE', 'drawPolygon'])}
      >
        <img src="/img/polygon.svg" alt="Draw polygon" />
      </button>
      <button
        className={`${styles.button} `}
        type="button"
        tabIndex={-1}
        id="toolbar"
        onClick={() => dispatch(['SET_MODE', 'drawPoint'])}
      >
        <img src="/img/point.svg" alt="Draw point" />
      </button>
    </div>
  );
}
