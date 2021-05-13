import React from 'react';

import { useDraw } from '../../providers/DrawProvider';
import styles from './Toolbar.module.css';

export default function Toolbar() {
  const [{ editing, modeId }, dispatch] = useDraw();

  return (
    <div
      style={{ position: 'absolute', left: 15, top: 235, display: 'flex', flexDirection: 'column' }}
    >
      <button
        className={styles.button}
        type="button"
        tabIndex={-1}
        id="toolbar"
        onClick={() => dispatch(['TOGGLE_EDITING'])}
      >
        <img
          src={editing ? '/img/pen-active.svg' : '/img/pen.svg'}
          alt="Toggle edit mode"
          className={styles.icon}
        />
      </button>
      {editing && (
        <>
          <button
            className={styles.button}
            style={{ backgroundColor: modeId === 'drawPolyline' ? '#ccc' : null }}
            type="button"
            tabIndex={-1}
            id="toolbar"
            onClick={() => dispatch(['SET_MODE', 'drawPolyline'])}
          >
            <img src="/img/LineString.svg" alt="Draw line" className={styles.icon} />
          </button>
          <button
            className={styles.button}
            style={{ backgroundColor: modeId === 'drawPolygon' ? '#ccc' : null }}
            type="button"
            tabIndex={-1}
            id="toolbar"
            onClick={() => dispatch(['SET_MODE', 'drawPolygon'])}
          >
            <img src="/img/Polygon.svg" alt="Draw polygon" className={styles.icon} />
          </button>
          <button
            className={styles.button}
            style={{ backgroundColor: modeId === 'drawPoint' ? '#ccc' : null }}
            type="button"
            tabIndex={-1}
            id="toolbar"
            onClick={() => dispatch(['SET_MODE', 'drawPoint'])}
          >
            <img src="/img/Point.svg" alt="Draw point" className={styles.icon} />
          </button>
        </>
      )}
    </div>
  );
}
