const { Text, Relationship, Integer } = require('@keystonejs/fields');

const defaultAuth = ({ authentication: { item } }) => {
  if (item) {
    return {
      project: {
        user: {
          id: item.id,
        },
      },
    };
  }
  return false;
};

module.exports = {
  access: {
    auth: true,
    create: ({ authentication: { item } }) => item !== undefined,
    read: true,
    update: defaultAuth,
    delete: defaultAuth,
  },
  fields: {
    title: {
      type: Text,
    },
    index: {
      type: Integer,
    },
    feature: {
      type: Text,
    },
    slide: {
      type: Relationship,
      ref: 'Slide.annotations',
      many: false,
    },
  },
};
