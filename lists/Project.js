const { Text, Relationship, Select, Url, Checkbox } = require('@keystonejs/fields');
const { atTracking } = require('@keystonejs/list-plugins');
const { Wysiwyg } = require('@keystonejs/fields-wysiwyg-tinymce');

const userIsAdmin = ({ authentication: { item: user } }) => Boolean(user && user.isAdmin);

const defaultAuth = ({ existingItem, authentication: { item } }) =>
  item && existingItem.user.toString() === item.id;

const access = {
  auth: true,
  create: ({ authentication: { item } }) => item !== undefined,
  read: true,
  update: defaultAuth,
  delete: defaultAuth,
};

module.exports = {
  fields: {
    title: {
      type: Text,
      isRequired: true,
      access,
    },
    description: {
      type: Wysiwyg,
      access,
    },
    tags: {
      type: Relationship,
      ref: 'Tag',
      many: true,
      access,
    },
    category: {
      type: Select,
      options: ['History', 'Architecture', 'Literature', 'Urbanism', 'Archaelogy', 'Environment'],
      access,
    },
    imageTitle: {
      type: Text,
      access,
    },
    source: {
      type: Text,
      access,
    },
    url: {
      type: Url,
      access,
    },
    published: {
      type: Checkbox,
      access,
    },
    gallery: {
      type: Checkbox,
      access: {
        read: true,
        update: userIsAdmin,
        create: userIsAdmin,
        delete: userIsAdmin,
      },
    },
    slides: {
      type: Relationship,
      ref: 'Slide.project',
      many: true,
      access,
    },
    user: {
      type: Relationship,
      ref: 'User.projects',
      many: false,
      access,
    },
  },
  plugins: [atTracking()],
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
