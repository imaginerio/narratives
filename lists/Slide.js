const { Text, Relationship, Float, Integer } = require('@keystonejs/fields');
const { Wysiwyg } = require('@keystonejs/fields-wysiwyg-tinymce');

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
    read: defaultAuth,
    update: defaultAuth,
    delete: defaultAuth,
  },
  fields: {
    title: {
      type: Text,
      isRequired: true,
    },
    description: {
      type: Wysiwyg,
    },
    year: {
      type: Integer,
    },
    longitude: {
      type: Float,
    },
    latitude: {
      type: Float,
    },
    zoom: {
      type: Float,
    },
    bearing: {
      type: Float,
    },
    pitch: {
      type: Float,
    },
    project: {
      type: Relationship,
      ref: 'Project.slides',
      many: false,
    },
  },
  labelField: 'title',
  hooks: {
    resolveInput: ({ operation, resolvedData, context }) => {
      if (operation === 'create') {
        return {
          ...resolvedData,
          user: context.authedItem.id,
        };
      }
      return resolvedData;
    },
  },
};
