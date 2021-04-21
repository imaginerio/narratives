/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { Editor } from '@tinymce/tinymce-react';

const Wysiwyg = ({ label, value, onEditorChange }) => (
  <Form.Field>
    <label>{label}</label>
    <Editor
      apiKey={process.env.NEXT_PUBLIC_MCE_KEY}
      value={value}
      init={{
        height: 400,
        menubar: false,
        plugins: ['link lists paste'],
        toolbar: 'bold italic superscript bullist numlist | link unlink | undo redo',
        branding: false,
        statusbar: false,
        paste_as_text: true,
      }}
      onEditorChange={onEditorChange}
    />
  </Form.Field>
);

Wysiwyg.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onEditorChange: PropTypes.func.isRequired,
};

Wysiwyg.defaultProps = {
  label: null,
  value: null,
};

export default Wysiwyg;
