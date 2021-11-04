const { Text, Relationship } = require('@keystonejs/fields');

const defaultAuth = ({ existingItem, authentication: { item } }) =>
  item && existingItem.slide.project.user.toString() === item.id;

module.exports = {
  access: {
    auth: true,
    create: ({ authentication: { item } }) => item !== undefined,
    read: true,
    update: defaultAuth,
    delete: defaultAuth,
  },
  fields: {
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
