/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import 'react-quill/dist/quill.snow.css';

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
  ],
};

const formats = [
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
];

const Wysiwyg = ({ label, value, onEditorChange }) => {
  const ReactQuill = useMemo(() => dynamic(async () => import('react-quill'), { ssr: false }), []);
  return (
    <Form.Field>
      <label>{label}</label>
      <ReactQuill
        style={{
          backgroundColor: 'white',
          width: '100%',
          height: '400px',
        }}
        formats={formats}
        modules={modules}
        value={value}
        onChange={onEditorChange}
      />
    </Form.Field>
  );
};

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
