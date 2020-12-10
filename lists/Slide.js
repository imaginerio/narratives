const { Text, Relationship, Float, Integer, Select } = require('@keystonejs/fields');
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
    read: true,
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
    order: {
      type: Integer,
    },
    size: {
      type: Select,
      options: 'Fullscreen, Medium, Small',
    },
    year: {
      type: Integer,
      defaultValue: 1900,
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
    selectedFeature: {
      type: Text,
    },
    layers: {
      type: Relationship,
      ref: 'Layer',
      many: true,
    },
    basemap: {
      type: Relationship,
      ref: 'Basemap',
      many: false,
    },
    opacity: {
      type: Float,
      defaultValue: 1,
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
