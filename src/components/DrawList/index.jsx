/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Button, List, Segment, Form } from 'semantic-ui-react';

import { useDraw } from '../../providers/DrawProvider';
import styles from './DrawList.module.css';

export default function Toolbar() {
  const [{ features }, dispatch] = useDraw();

  if (!features || features.length === 0) return null;
  return (
    <Form.Field>
      <label>Features</label>
      <Segment>
        <List divided verticalAlign="middle">
          {features.map((feature, index) => (
            <List.Item key={index}>
              <List.Content floated="right">
                <Button size="tiny" onClick={() => dispatch(['SET_SELECTED_FEATURE_INDEX', index])}>
                  Edit
                </Button>
                <Button size="tiny" onClick={() => dispatch(['DEL_FEATURE', index])}>
                  Delete
                </Button>
              </List.Content>
              <List.Content verticalAlign="middle" className={styles.title}>
                Feature {index + 1}
              </List.Content>
            </List.Item>
          ))}
        </List>
      </Segment>
    </Form.Field>
  );
}
