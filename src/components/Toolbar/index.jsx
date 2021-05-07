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
        line
      </button>
      <button
        className={`${styles.button} `}
        type="button"
        tabIndex={-1}
        id="toolbar"
        onClick={() => dispatch(['SET_MODE', 'drawPolygon'])}
      >
        poly
      </button>
      <button
        className={`${styles.button} `}
        type="button"
        tabIndex={-1}
        id="toolbar"
        onClick={() => dispatch(['SET_MODE', 'drawPoint'])}
      >
        point
      </button>
    </div>
  );
}
