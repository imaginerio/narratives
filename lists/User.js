/* eslint-disable no-use-before-define */
const { Text, Relationship, Checkbox, Password } = require('@keystonejs/fields');

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
      access: {
        read: access.userIsAdminOrOwner,
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
};
