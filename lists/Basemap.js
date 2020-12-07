const { Text, Integer, Float } = require('@keystonejs/fields');

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
  },
  labelField: 'title',
};
