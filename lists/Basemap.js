const { Text, Integer, Float, Url } = require('@keystonejs/fields');

module.exports = {
  fields: {
    ssid: {
      type: Text,
    },
    title: {
      type: Text,
    },
    remoteId: {
      type: Integer,
    },
    firstYear: {
      type: Integer,
    },
    lastYear: {
      type: Integer,
    },
    longitude: {
      type: Float,
    },
    latitude: {
      type: Float,
    },
    thumbnail: {
      type: Url,
    },
    creator: {
      type: Text,
    },
  },
  labelField: 'title',
};
