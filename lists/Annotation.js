const { Text, Relationship } = require('@keystonejs/fields');
const { gql } = require('apollo-server-express');

const defaultAuth = async ({ context, existingItem, authentication: { item } }) => {
  const slide = existingItem.slide.toString();
  const { data } = await context.executeGraphQL({
    query: gql`
      query getUser($slide: ID!) {
        Slide(where: { id: $slide }) {
          project {
            user {
              id
            }
          }
        }
      }
    `,
    variables: { slide },
  });

  return data && item && data.Slide.project.user.id === item.id;
};

const access = {
  auth: true,
  create: ({ authentication: { item } }) => item !== undefined,
  read: true,
  update: defaultAuth,
  delete: defaultAuth,
};

module.exports = {
  fields: {
    feature: {
      type: Text,
      access,
    },
    slide: {
      type: Relationship,
      ref: 'Slide.annotations',
      many: false,
      access,
    },
  },
};
