/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { pick } from 'lodash';
import { Segment, Image as Img, Form, Input, Button } from 'semantic-ui-react';

import styles from './Image.module.css';

const Image = ({ image, addHandler, updateHandler }) => {
  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [imageMeta, setImageMeta] = useState({
    title: '',
    creator: '',
    source: '',
    date: '',
  });

  useEffect(() => setImageMeta(pick(image, Object.keys(imageMeta))), [image]);

  const getSignedUrl = e => {
    const [file] = e.target.files;
    if (file) {
      setIsLoading(true);
      return axios.post('/upload', { name: file.name, type: file.type }).then(({ data }) => {
        return axios
          .put(data.signedRequest, file, { headers: { 'Content-Type': file.type } })
          .then(() => {
            setIsLoading(false);
            updateHandler(image.id, { url: data.url }, 1);
          });
      });
    }
    return null;
  };

  return (
    <Segment>
      {image ? (
        <>
          {image.url ? (
            <>
              <Img src={image.url} />
              <Button
                className={styles.closeButton}
                circular
                icon="close"
                size="mini"
                onClick={() => updateHandler(image.id, { url: null }, 1)}
              />
            </>
          ) : (
            <>
              <Button
                content="Choose File"
                labelPosition="left"
                icon="file"
                onClick={() => fileInputRef.current.click()}
                  loading={isLoading}
              />
              <input ref={fileInputRef} type="file" hidden onChange={getSignedUrl} />
            </>
          )}
          <Form.Field inline style={{ marginTop: 15 }}>
            <label className={styles.inlineLabel}>Title</label>
            <Input
              className={styles.inlineInput}
              value={imageMeta.title}
              onChange={(e, { value }) => {
                setImageMeta({ ...imageMeta, title: value });
                updateHandler(image.id, imageMeta);
              }}
            />
          </Form.Field>
          <Form.Field inline>
            <label className={styles.inlineLabel}>Creator</label>
            <Input
              className={styles.inlineInput}
              value={imageMeta.creator}
              onChange={(e, { value }) => {
                setImageMeta({ ...imageMeta, creator: value });
                updateHandler(image.id, imageMeta);
              }}
            />
          </Form.Field>
          <Form.Field inline>
            <label className={styles.inlineLabel}>Source</label>
            <Input
              className={styles.inlineInput}
              value={imageMeta.source}
              onChange={(e, { value }) => {
                setImageMeta({ ...imageMeta, source: value });
                updateHandler(image.id, imageMeta);
              }}
            />
          </Form.Field>
          <Form.Field inline>
            <label className={styles.inlineLabel}>Date</label>
            <Input
              className={styles.inlineInput}
              value={imageMeta.date}
              onChange={(e, { value }) => {
                setImageMeta({ ...imageMeta, date: value });
                updateHandler(image.id, imageMeta);
              }}
            />
          </Form.Field>
        </>
      ) : (
        <Button content="Add an image" onClick={addHandler} />
      )}
    </Segment>
  );
};

Image.propTypes = {
  image: PropTypes.shape(),
  addHandler: PropTypes.func.isRequired,
  updateHandler: PropTypes.func.isRequired,
};

Image.defaultProps = {
  image: null,
};

export default Image;
