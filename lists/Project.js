const { Text, Relationship, Select } = require('@keystonejs/fields');
const { Wysiwyg } = require('@keystonejs/fields-wysiwyg-tinymce');

module.exports = {
  fields: {
    title: {
      type: Text,
      isRequired: true,
    },
    description: {
      type: Wysiwyg,
    },
    // tags: {
    //   type: Relationship,
    //   ref: 'Tag',
    //   many: true,
    // },
    category: {
      type: Select,
      options: ['History', 'Architecture', 'Literature'],
    },
    user: {
      type: Relationship,
      ref: 'User.projects',
      many: false,
    },
  },
  labelField: 'title',
};
