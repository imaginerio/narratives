module.exports.userIsAdmin = ({ authentication: { item: user } }) => Boolean(user && user.isAdmin);

module.exports.createDefaultAccess = defaultAuth => ({
  auth: true,
  create: ({ authentication: { item } }) => item !== undefined,
  read: true,
  update: defaultAuth,
  delete: defaultAuth,
});
