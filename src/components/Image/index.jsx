/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Segment, Image as Img, Form, Input, Button } from 'semantic-ui-react';

import styles from './Image.module.css';

const Image = ({ image, updateHandler }) => {
  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [urlError, setUrlError] = useState(false);
  const [imageMeta, setImageMeta] = useState(null);

  useEffect(() => {
    if (image) {
      setImageMeta({
        imageTitle: image.imageTitle,
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
      {image?.url ? (
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
      <Form.Field inline style={{ marginTop: 15 }} disabled={!image?.url}>
        <label className={styles.inlineLabel}>Caption</label>
        <Input
          placeholder="Image caption"
          className={styles.inlineInput}
          value={imageMeta && image.url ? imageMeta.imageTitle || '' : ''}
          onChange={(e, { value }) => {
            setImageMeta({ ...imageMeta, imageTitle: value });
            updateHandler(image.id, { imageTitle: value });
          }}
        />
      </Form.Field>
      <Form.Field inline disabled={!image?.url} error={urlError}>
        <label className={styles.inlineLabel}>Link</label>
        <Input
          placeholder="https://..."
          className={styles.inlineInput}
          value={imageMeta ? imageMeta.source || '' : ''}
          onChange={(e, { value }) => {
            setImageMeta({ ...imageMeta, source: value });
            if (
              !value ||
              value.match(
                /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/
              )
            ) {
              updateHandler(image.id, { source: value });
              setUrlError(false);
            } else {
              setUrlError(true);
            }
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
