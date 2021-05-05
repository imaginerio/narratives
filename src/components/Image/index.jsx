/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Segment, Image as Img, Form, Input, Button } from 'semantic-ui-react';

import styles from './Image.module.css';

const Image = ({ image, updateHandler }) => {
  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [imageMeta, setImageMeta] = useState({
    imageTitle: image.imageTitle,
    creator: image.creator,
    source: image.source,
  });

  useEffect(() => {
    if (image) {
      setImageMeta({
        imageTitle: image.imageTitle,
        creator: image.creator,
        source: image.source,
      });
    }
  }, [image]);

  const getSignedUrl = e => {
    const file = e.target.files[0];
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
      <Form.Field inline style={{ marginTop: 15 }} disabled={!image.url}>
        <label className={styles.inlineLabel}>Title</label>
        <Input
          className={styles.inlineInput}
          value={imageMeta ? imageMeta.imageTitle || '' : ''}
          onChange={(e, { value }) => {
            setImageMeta({ ...imageMeta, imageTitle: value });
            updateHandler(image.id, { imageTitle: value });
          }}
        />
      </Form.Field>
      <Form.Field inline disabled={!image.url}>
        <label className={styles.inlineLabel}>Creator</label>
        <Input
          className={styles.inlineInput}
          value={imageMeta ? imageMeta.creator || '' : ''}
          onChange={(e, { value }) => {
            setImageMeta({ ...imageMeta, creator: value });
            updateHandler(image.id, { creator: value });
          }}
        />
      </Form.Field>
      <Form.Field inline disabled={!image.url}>
        <label className={styles.inlineLabel}>Source</label>
        <Input
          className={styles.inlineInput}
          value={imageMeta ? imageMeta.source || '' : ''}
          onChange={(e, { value }) => {
            setImageMeta({ ...imageMeta, source: value });
            updateHandler(image.id, { source: value });
          }}
        />
      </Form.Field>
    </Segment>
  );
};

Image.propTypes = {
  image: PropTypes.shape(),
  updateHandler: PropTypes.func.isRequired,
};

Image.defaultProps = {
  image: null,
};

export default Image;
