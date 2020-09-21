const { Text, Integer } = require('@keystonejs/fields');

module.exports = {
  fields: {
    layerId: {
      type: Text,
    },
    title: {
      type: Text,
    },
    remoteId: {
      type: Integer,
    },
  },
  labelField: 'title',
};
