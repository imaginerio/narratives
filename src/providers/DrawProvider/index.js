import React, { useContext, createContext, useReducer, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation, gql } from '@apollo/client';
import { last } from 'lodash';
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
  ids: [],
  selectedFeatureIndex: '',
  clickRadius: 12,
  slide: null,
};

const GET_ANNOTATIONS = gql`
  query GetAnnotations($slide: ID!) {
    Slide(where: { id: $slide }) {
      id
      annotations {
        id
        title
        feature
        index
      }
    }
  }
`;

const CREATE_ANNOTATION = gql`
  mutation CreateAnnotation(
    $title: String
    $index: Int
    $feature: String
    $slide: SlideRelateToOneInput
  ) {
    createAnnotation(data: { title: $title, index: $index, feature: $feature, slide: $slide }) {
      id
    }
  }
`;

const UPDATE_ANNOTATION_FEATURE = gql`
  mutation UpdateAnnotation($id: ID!, $feature: String) {
    updateAnnotation(id: $id, data: { feature: $feature }) {
      id
    }
  }
`;

function reducer(state, [type, payload]) {
  // console.log(type, payload);
  switch (type) {
    case 'SET_MODE': {
      const modeId = payload;
      const mode = MODES.find(m => m.id === modeId);
      const modeHandler = mode ? new mode.Handler() : null;
      return { ...state, mode: modeHandler };
    }
    case 'SET_FEATURES': {
      return { ...state, features: payload };
    }
    case 'SET_IDS': {
      return { ...state, ids: payload };
    }
    case 'SET_SELECTED_FEATURE_INDEX': {
      return { ...state, selectedFeatureIndex: payload };
    }
    case 'DEL_FEATURE': {
      return {
        ...state,
        features: state.features.filter((feature, index) => payload !== index),
      };
    }
    case 'SLIDE': {
      return {
        ...state,
        slide: payload,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${type}`);
    }
  }
}

function DrawProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [createAnnotation] = useMutation(CREATE_ANNOTATION);
  const [updateAnnotation] = useMutation(UPDATE_ANNOTATION_FEATURE);
  const { data: annotations } = useQuery(GET_ANNOTATIONS, { variables: { slide: state.slide } });

  const updateTimer = useRef();

  function onSelect(e) {
    const { selectedFeatureIndex } = e;
    dispatch(['SET_SELECTED_FEATURE_INDEX', selectedFeatureIndex]);
  }

  function onUpdate(e) {
    const { data, editType } = e;

    dispatch(['SET_FEATURES', data]);

    switch (editType) {
      case 'addFeature': {
        dispatch(['SET_MODE', 'editing']);
        const newFeature = last(data);
        const index = data.length - 1;
        createAnnotation({
          variables: {
            title: `Feature ${index}`,
            feature: JSON.stringify(newFeature),
            index,
            slide: {
              connect: {
                id: state.slide,
              },
            },
          },
          refetchQueries: [{ query: GET_ANNOTATIONS, variables: { slide: state.slide } }],
        });
        break;
      }
      case 'movePosition': {
        const { ids, selectedFeatureIndex } = state;
        const id = ids[selectedFeatureIndex];
        const feature = JSON.stringify(data[selectedFeatureIndex]);
        clearTimeout(updateTimer.current);
        updateTimer.current = setTimeout(
          () =>
            updateAnnotation({
              variables: { id, feature },
              refetchQueries: [{ query: GET_ANNOTATIONS, variables: { slide: state.slide } }],
            }),
          500
        );
        break;
      }
      default:
        break;
    }
  }

  useEffect(() => {
    if (annotations) {
      dispatch(['SET_FEATURES', annotations.Slide.annotations.map(a => JSON.parse(a.feature))]);
      dispatch(['SET_IDS', annotations.Slide.annotations.map(a => a.id)]);
    }
  }, [annotations]);

  return (
    <StateContext.Provider value={{ ...state, onUpdate, onSelect }}>
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

function useDrawDispatch() {
  const context = useContext(DispatchContext);

  if (context === undefined) {
    throw new Error('useDrawDispatch must be used within a DrawProvider');
  }

  return context;
}

function useDraw() {
  return [useDrawState(), useDrawDispatch()];
}

DrawProvider.propTypes = {
  children: PropTypes.string.isRequired,
};

export { DrawProvider, useDrawState, useDrawDispatch, useDraw };
