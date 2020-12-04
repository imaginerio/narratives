const { Text, Integer } = require('@keystonejs/fields');

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
  },
  labelField: 'title',
};
