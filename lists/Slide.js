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
    },
    description: {
      type: Wysiwyg,
    },
    year: {
      type: Integer,
    },
    longitude: {
      type: Float,
      defaultValue: -43.1,
    },
    latitude: {
      type: Float,
      defaultValue: -22.9,
    },
    zoom: {
      type: Float,
      defaultValue: 12,
    },
    bearing: {
      type: Float,
      defaultValue: 0,
    },
    pitch: {
      type: Float,
      defaultValue: 0,
    },
    image: {
      type: Relationship,
      ref: 'Image.slide',
      many: false,
    },
    project: {
      type: Relationship,
      ref: 'Project.slides',
      many: false,
    },
  },
  labelField: 'title',
};
