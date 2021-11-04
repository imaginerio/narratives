const { Text, Relationship, Float, Integer, Select, Url } = require('@keystonejs/fields');
const { Wysiwyg } = require('@keystonejs/fields-wysiwyg-tinymce');
const { gql } = require('apollo-server-express');

const defaultAuth = ({ existingItem, authentication: { item } }) => {
  console.log(
    existingItem.project,
    JSON.stringify(existingItem.project),
    JSON.parse(JSON.stringify(existingItem.project))
  );
  return item && existingItem.project.user.toString() === item.id;
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
      defaultValue: 'Small',
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
    media: {
      type: Url,
    },
    imageTitle: {
      type: Text,
    },
    source: {
      type: Url,
    },
    url: {
      type: Url,
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
    annotations: {
      type: Relationship,
      ref: 'Annotation.slide',
      many: true,
    },
  },
  labelField: 'title',
  hooks: {
    resolveInput: async ({ operation, resolvedData, context }) => {
      if (operation === 'create') {
        const { project, order } = resolvedData;
        const {
          data: {
            Project: { slides },
          },
        } = await context.executeGraphQL({
          query: gql`
            query lastSlide($project: ID!) {
              Project(where: { id: $project }) {
                slides(sortBy: order_ASC) {
                  year
                  latitude
                  longitude
                  zoom
                  pitch
                  bearing
                }
              }
            }
          `,
          variables: { project },
        });

        const slide = slides[(order || slides.length) - 1];
        return { ...resolvedData, ...slide, order };
      }
      return resolvedData;
    },
  },
};
