import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Button, List, Segment, Form } from 'semantic-ui-react';

import { useDraw } from '../../providers/DrawProvider';
import styles from './DrawList.module.css';

const GET_ANNOTATIONS = gql`
  query GetAnnotations($slide: ID!) {
    Slide(where: { id: $slide }) {
      id
      annotations {
        id
        title
        feature
      }
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
  const [, dispatch] = useDraw();
  const { data } = useQuery(GET_ANNOTATIONS, { variables: { slide } });
  const [deleteAnnotation] = useMutation(DELETE_ANNOTATION);

  useEffect(() => {
    if (data) {
      setFeatures(data.Slide.annotations);
    }
  }, [data]);

  if (!features || features.length === 0) return null;
  return (
    <Form.Field>
      <label>Features</label>
      <Segment>
        <List divided verticalAlign="middle">
          {features.map((feature, index) => (
            <List.Item key={feature.id}>
              <List.Content floated="right">
                <Button size="tiny" onClick={() => dispatch(['SET_SELECTED_FEATURE_INDEX', index])}>
                  Edit
                </Button>
                <Button
                  size="tiny"
                  onClick={() =>
                    deleteAnnotation({
                      variables: { id: feature.id },
                      refetchQueries: [{ query: GET_ANNOTATIONS, variables: { slide } }],
                    })
                  }
                >
                  Delete
                </Button>
              </List.Content>
              <List.Content verticalAlign="middle" className={styles.title}>
                {feature.title}
              </List.Content>
            </List.Item>
          ))}
        </List>
      </Segment>
    </Form.Field>
  );
};

DrawList.propTypes = {
  slide: PropTypes.string.isRequired,
};

export default DrawList;
