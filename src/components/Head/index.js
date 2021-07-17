import React from 'react';
import PropTypes from 'prop-types';
import NextHead from 'next/head';

const Head = ({ title }) => (
  <NextHead>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta httpEquiv="x-ua-compatible" content="ie=edge" />
    <script
      async
      defer
      data-website-id="1d06d2f3-29d1-40c3-955f-ec63bfa731c9"
      src="https://umami.axismaps.com/umami.js"
    />
    <title>{title}</title>
  </NextHead>
);

Head.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Head;
