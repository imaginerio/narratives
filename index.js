const { Keystone } = require('@keystonejs/keystone');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const { NextApp } = require('@keystonejs/app-next');
const { MongooseAdapter: Adapter } = require('@keystonejs/adapter-mongoose');
const initialiseData = require('./initial-data');

const CheckAuthentication = require('./routes/authentication');
const S3Upload = require('./routes/upload');

const UserSchema = require('./lists/User');
const ProjectSchema = require('./lists/Project');
const SlideSchema = require('./lists/Slide');
const ImageSchema = require('./lists/Image');
const TagSchema = require('./lists/Tag');

const PROJECT_NAME = 'imagineRio Narratives';
const adapterConfig = { mongoUri: 'mongodb://localhost/imagine-rio-narratives' };

const keystone = new Keystone({
  adapter: new Adapter(adapterConfig),
  onConnect: process.env.CREATE_TABLES !== 'true' && initialiseData,
  cookieSecret: 'abc',
});

keystone.createList('User', UserSchema);
const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: 'User',
});

keystone.createList('Slide', SlideSchema);
keystone.createList('Image', ImageSchema);
keystone.createList('Project', ProjectSchema);
keystone.createList('Tag', TagSchema);

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    new AdminUIApp({
      name: PROJECT_NAME,
      enableDefaultRoute: false,
      authStrategy,
    }),
    new CheckAuthentication(),
    new S3Upload(),
    new NextApp({ dir: 'src' }),
  ],
};
