import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Segment, Image as Img, Button } from 'semantic-ui-react';

const Image = ({ image, addHandler, updateHandler }) => {
  console.log(image);
  const fileInputRef = useRef(null);

  const getSignedUrl = e => {
    const [file] = e.target.files;
    if (file) {
      return axios
        .post('/upload', { name: file.name, type: file.type })
        .then(({ data }) =>
          axios.put(data.signedUrl, file, { headers: { 'Content-Type': file.type } })
        );
    }
    return null;
  };

  return (
    <Segment>
      {image ? (
        <>
          {image.url ? (
            <Img src={image.url} />
          ) : (
            <>
              <Button
                content="Choose File"
                labelPosition="left"
                icon="file"
                onClick={() => fileInputRef.current.click()}
              />
              <input ref={fileInputRef} type="file" hidden onChange={getSignedUrl} />
            </>
          )}
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
};

Image.defaultProps = {
  image: {},
};

export default Image;
