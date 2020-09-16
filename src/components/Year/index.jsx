/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Form, Input } from 'semantic-ui-react';

import styles from './Year.module.css';

const Year = ({ year, handler }) => (
  <Segment className={styles.year}>
    <Form.Field inline>
      <label className={styles.yearLabel}>Year: </label>
      <Input type="number" value={year} onChange={(e, { value }) => handler(parseInt(value, 10))} />
    </Form.Field>
  </Segment>
);

Year.propTypes = {
  year: PropTypes.number.isRequired,
  handler: PropTypes.func.isRequired,
};

export default Year;
