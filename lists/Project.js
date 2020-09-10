const { Text, Relationship, Select } = require('@keystonejs/fields');
const { Wysiwyg } = require('@keystonejs/fields-wysiwyg-tinymce');

const defaultAuth = ({ authentication: { item } }) => {
  if (item) {
    return {
      user: {
        id: item.id,
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
    tags: {
      type: Relationship,
      ref: 'Tag',
      many: true,
    },
    category: {
      type: Select,
      options: ['History', 'Architecture', 'Literature'],
    },
    slides: {
      type: Relationship,
      ref: 'Slide.project',
      many: true,
    },
    user: {
      type: Relationship,
      ref: 'User.projects',
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
