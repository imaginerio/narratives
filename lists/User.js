/* eslint-disable no-use-before-define */
const { Text, Select, Relationship, Checkbox, Password } = require('@keystonejs/fields');
const uuid = require('uuid').v4;

const { sendEmail } = require('../server/email');

// Access control functions
const userIsAdmin = ({ authentication: { item: user } }) => Boolean(user && user.isAdmin);
const userOwnsItem = ({ existingItem: { id }, authentication: { item: user } }) => {
  if (!user) {
    return false;
  }
  return id === user.id;
};

const userIsAdminOrOwner = auth => {
  const isAdmin = access.userIsAdmin(auth);
  const isOwner = access.userOwnsItem(auth);
  return isAdmin || isOwner;
};

const access = { userIsAdmin, userOwnsItem, userIsAdminOrOwner };

module.exports = {
  fields: {
    name: {
      type: Text,
      access: {
        read: true,
        update: access.userIsAdminOrOwner,
        create: true,
        delete: access.userIsAdminOrOwner,
      },
    },
    email: {
      type: Text,
      isUnique: true,
      isRequired: true,
      access: {
        read: true,
        update: access.userIsAdminOrOwner,
        create: true,
        delete: access.userIsAdminOrOwner,
      },
    },
    institution: {
      type: Text,
      access: {
        read: true,
        update: access.userIsAdminOrOwner,
        create: true,
        delete: access.userIsAdminOrOwner,
      },
    },
    language: {
      type: Select,
      options: [
        { value: 'en', label: 'English' },
        { value: 'pt', label: 'Portuguese' },
      ],
      access: {
        read: true,
        update: access.userIsAdminOrOwner,
        create: true,
        delete: access.userIsAdminOrOwner,
      },
    },
    verified: {
      type: Checkbox,
      access: {
        read: true,
        update: true,
        create: true,
        delete: true,
      },
    },
    verifyId: {
      type: Text,
      defaultValue: uuid(),
      access: {
        read: true,
        update: access.userIsAdmin,
        create: access.userIsAdmin,
        delete: access.userIsAdmin,
      },
    },
    resetId: {
      type: Text,
      access: {
        read: true,
        update: access.userIsAdminOrOwner,
        create: true,
        delete: true,
      },
    },
    isAdmin: {
      type: Checkbox,
      // Field-level access controls
      // Here, we set more restrictive field access so a non-admin cannot make themselves admin.
      access: {
        read: access.userIsAdminOrOwner,
        update: access.userIsAdmin,
        create: access.userIsAdmin,
        delete: access.userIsAdmin,
      },
    },
    password: {
      type: Password,
      access: {
        read: access.userIsAdminOrOwner,
        update: access.userIsAdminOrOwner,
        create: true,
        delete: access.userIsAdmin,
      },
    },
    termsAccepted: {
      type: Checkbox,
      access: {
        read: access.userIsAdminOrOwner,
        update: access.userIsAdminOrOwner,
        create: access.userIsAdminOrOwner,
        delete: access.userIsAdminOrOwner,
      },
    },
    privacyAccepted: {
      type: Checkbox,
      access: {
        read: access.userIsAdminOrOwner,
        update: access.userIsAdminOrOwner,
        create: access.userIsAdminOrOwner,
        delete: access.userIsAdminOrOwner,
      },
    },
    projects: {
      type: Relationship,
      ref: 'Project.user',
      many: true,
      access: {
        read: access.userIsAdminOrOwner,
        update: access.userIsAdminOrOwner,
        create: access.userIsAdmin,
        delete: access.userIsAdmin,
      },
    },
  },
  hooks: {
    afterChange: async ({ operation, updatedItem, context }) => {
      if (operation === 'create') {
        const {
          req: { protocol, hostname },
        } = context;
        sendEmail({
          to: updatedItem.email,
          key: updatedItem.verifyId,
          host: `${protocol}://${hostname}`,
          lang: updatedItem.language,
        });
      }
    },
  },
};
