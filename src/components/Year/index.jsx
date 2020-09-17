/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'semantic-ui-react';

import styles from './Year.module.css';

const Year = ({ year, handler }) => (
  <Form.Field inline>
    <label className={styles.yearLabel}>Year: </label>
    <Input type="number" value={year} onChange={(e, { value }) => handler(parseInt(value, 10))} />
  </Form.Field>
);

Year.propTypes = {
  year: PropTypes.number.isRequired,
  handler: PropTypes.func.isRequired,
};

export default Year;
