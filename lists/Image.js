const { Text, Url, Relationship } = require('@keystonejs/fields');

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
