const { Text, Relationship } = require('@keystonejs/fields');

const defaultAuth = ({ authentication: { item } }) => {
  if (item) {
    return {
      slide: {
        project: {
          user: {
            id: item.id,
          },
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
