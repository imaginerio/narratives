const { Text, Url, Relationship } = require('@keystonejs/fields');
const { userIsAdmin } = require('./access');

module.exports = {
  access: {
    auth: true,
    create: ({ authentication: { item } }) => item !== undefined,
    read: true,
    update: userIsAdmin,
    delete: userIsAdmin,
  },
  fields: {
    title: {
      type: Text,
    },
    creator: {
      type: Text,
    },
    source: {
      type: Text,
    },
    date: {
      type: Text,
    },
    url: {
      type: Url,
    },
    slide: {
      type: Relationship,
      ref: 'Slide.image',
      many: false,
    },
  },
  labelField: 'title',
};
