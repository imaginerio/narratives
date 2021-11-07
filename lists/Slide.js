const { Text, Relationship, Float, Integer, Select, Url } = require('@keystonejs/fields');
const { Wysiwyg } = require('@keystonejs/fields-wysiwyg-tinymce');
const { gql } = require('apollo-server-express');

const { createDefaultAccess } = require('./access');

const defaultAuth = async ({ context, existingItem, authentication: { item } }) => {
  const project = existingItem.project.toString();
  const { data } = await context.executeGraphQL({
    query: gql`
      query getUser($project: ID!) {
        Project(where: { id: $project }) {
          user {
            id
          }
        }
      }
    `,
    variables: { project },
  });

  return (data && item && data.Project.user.id === item.id) || item.isAdmin;
};

const access = createDefaultAccess(defaultAuth);

module.exports = {
  fields: {
    title: {
      type: Text,
      access,
    },
    description: {
      type: Wysiwyg,
      access,
    },
    order: {
      type: Integer,
      access,
    },
    size: {
      type: Select,
      options: 'Fullscreen, Medium, Small',
      defaultValue: 'Small',
      access,
    },
    year: {
      type: Integer,
      defaultValue: 1900,
      access,
    },
    longitude: {
      type: Float,
      defaultValue: -43.1,
      access,
    },
    latitude: {
      type: Float,
      defaultValue: -22.9,
      access,
    },
    zoom: {
      type: Float,
      defaultValue: 12,
      access,
    },
    bearing: {
      type: Float,
      defaultValue: 0,
      access,
    },
    pitch: {
      type: Float,
      defaultValue: 0,
      access,
    },
    selectedFeature: {
      type: Text,
      access,
    },
    layers: {
      type: Relationship,
      ref: 'Layer',
      many: true,
      access,
    },
    basemap: {
      type: Relationship,
      ref: 'Basemap',
      many: false,
      access,
    },
    opacity: {
      type: Float,
      defaultValue: 1,
      access,
    },
    media: {
      type: Url,
      access,
    },
    imageTitle: {
      type: Text,
      access,
    },
    source: {
      type: Url,
      access,
    },
    url: {
      type: Url,
      access,
    },
    image: {
      type: Relationship,
      ref: 'Image.slide',
      many: false,
      access,
    },
    project: {
      type: Relationship,
      ref: 'Project.slides',
      many: false,
      access,
    },
    annotations: {
      type: Relationship,
      ref: 'Annotation.slide',
      many: true,
      access,
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
