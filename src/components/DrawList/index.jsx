/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Button, List, Segment, Form, Input } from 'semantic-ui-react';

import { useDraw } from '../../providers/DrawProvider';
import styles from './DrawList.module.css';

export const GET_ANNOTATIONS = gql`
  query GetAnnotations($slide: ID!) {
    Slide(where: { id: $slide }) {
      id
      annotations {
        id
        feature
      }
    }
  }
`;

const UPDATE_ANNOTATION_FEATURE = gql`
  mutation UpdateAnnotation($id: ID!, $feature: String) {
    updateAnnotation(id: $id, data: { feature: $feature }) {
      id
      feature
    }
  }
`;

const DELETE_ANNOTATION = gql`
  mutation DeleteAnnotation($id: ID!) {
    deleteAnnotation(id: $id) {
      id
    }
  }
`;

const DrawList = ({ slide }) => {
  const [features, setFeatures] = useState([]);
  const [titles, setTitles] = useState([]);
  const [{ editing }, dispatch] = useDraw();
  const { data } = useQuery(GET_ANNOTATIONS, { variables: { slide } });
  const [deleteAnnotation] = useMutation(DELETE_ANNOTATION);
  const [updateAnnotation] = useMutation(UPDATE_ANNOTATION_FEATURE);
  const updateTimer = useRef();

  useEffect(() => {
    if (data) {
      setFeatures(data.Slide.annotations);
      setTitles(data.Slide.annotations.map(a => JSON.parse(a.feature).properties.title));
    }
  }, [data]);

  if (!features || features.length === 0) return null;
  return (
    <Form.Field>
      <label>Features</label>
      <Segment>
        <List divided verticalAlign="middle">
          {features.map(({ id, feature }, index) => {
            const newFeature = JSON.parse(feature);
            const {
              geometry: { type },
            } = newFeature;
            return (
              <List.Item key={id}>
                <List.Content>
                  <div className={styles.input}>
                    <img src={`/img/${type}.svg`} className={styles.icon} alt={type} />
                    <Input
                      disabled={!editing}
                      size="mini"
                      value={titles[index]}
                      onChange={(e, { value }) => {
                        setTitles(titles.map((t, i) => (i === index ? value : t)));
                        clearTimeout(updateTimer.current);
                        updateTimer.current = setTimeout(() => {
                          const updatedFeature = {
                            ...newFeature,
                            properties: { ...newFeature.properties, title: value },
                          };
                          const featureString = JSON.stringify(updatedFeature);
                          updateAnnotation({
                            variables: { id, feature: featureString },
                            optimisticResponse: {
                              __typename: 'Mutation',
                              updateAnnotation: {
                                __typename: 'Annotation',
                                id,
                                feature: featureString,
                              },
                            },
                          });
                        }, 500);
                      }}
                    />
                    <div>
                      <Button
                        size="tiny"
                        icon="edit outline"
                        disabled={!editing}
                        onClick={() => dispatch(['SET_SELECTED_FEATURE_INDEX', index])}
                      />
                      <Button
                        size="tiny"
                        icon="trash alternate"
                        disabled={!editing}
                        onClick={() =>
                          deleteAnnotation({
                            variables: { id },
                            refetchQueries: [{ query: GET_ANNOTATIONS, variables: { slide } }],
                          })
                        }
                      />
                    </div>
                  </div>
                </List.Content>
              </List.Item>
            );
          })}
        </List>
      </Segment>
    </Form.Field>
  );
};

DrawList.propTypes = {
  slide: PropTypes.string.isRequired,
};

export default DrawList;
