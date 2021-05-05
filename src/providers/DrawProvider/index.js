import React, { useContext, createContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import { DrawPolygonMode, DrawLineStringMode, EditingMode, DrawPointMode } from 'react-map-gl-draw';

const StateContext = createContext();
const DispatchContext = createContext();

const MODES = [
  { id: 'drawPolyline', text: 'Draw Polyline', Handler: DrawLineStringMode },
  { id: 'drawPolygon', text: 'Draw Polygon', Handler: DrawPolygonMode },
  { id: 'editing', text: 'Edit Feature', Handler: EditingMode },
  { id: 'drawPoint', text: 'Edit Feature', Handler: DrawPointMode },
];

const INITIAL_STATE = {
  mode: null,
  features: [],
  selectedFeatureIndex: '',
};

function reducer(state, [type, payload]) {
  console.log(type, payload);
  switch (type) {
    case 'SET_MODE': {
      const modeId = payload;
      const mode = MODES.find(m => m.id === modeId);
      const modeHandler = mode ? new mode.Handler() : null;
      return { ...state, mode: modeHandler };
    }
    default: {
      throw new Error(`Unhandled action type: ${type}`);
    }
  }
}

function DrawProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  );
}

function useDrawState() {
  const context = useContext(StateContext);

  if (context === undefined) {
    throw new Error('useDrawState must be used within a DrawProvider');
  }

  return context;
}

function useDrawDispatch(features) {
  const context = useContext(DispatchContext);

  if (context === undefined) {
    throw new Error('useDrawDispatch must be used within a DrawProvider');
  }

  //   useEffect(() => {
  //     context.dispatch('SET_GEOJSON', { geoJson: features });
  //   }, [features]);

  return context;
}

function useDraw(features, featureService) {
  return [useDrawState(), useDrawDispatch(features, featureService)];
}

DrawProvider.propTypes = {
  children: PropTypes.string.isRequired,
};

export { DrawProvider, useDrawState, useDrawDispatch, useDraw };
