const { Text } = require('@keystonejs/fields');

const defaultAuth = ({ authentication: { item } }) => item !== undefined;

module.exports = {
  access: {
    auth: true,
    create: defaultAuth,
    read: defaultAuth,
    update: defaultAuth,
    delete: defaultAuth,
  },
  fields: {
    name: {
      type: Text,
      isRequired: true,
      isUnique: true,
    },
  },
  labelField: 'name',
};
