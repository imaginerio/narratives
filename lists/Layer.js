const { Text } = require('@keystonejs/fields');

module.exports = {
  fields: {
    layerId: {
      type: Text,
    },
    title: {
      type: Text,
    },
  },
  labelField: 'title',
};
