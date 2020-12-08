require('dotenv-safe').config();
const { Keystone } = require('@keystonejs/keystone');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const { NextApp } = require('@keystonejs/app-next');
const { MongooseAdapter: Adapter } = require('@keystonejs/adapter-mongoose');
const expressSession = require('express-session');
const MongoStore = require('connect-mongo')(expressSession);
const initialiseData = require('./initial-data');

const CheckAuthentication = require('./routes/authentication');
const S3Upload = require('./routes/upload');

const UserSchema = require('./lists/User');
const ProjectSchema = require('./lists/Project');
const SlideSchema = require('./lists/Slide');
const ImageSchema = require('./lists/Image');
const TagSchema = require('./lists/Tag');
const LayerSchema = require('./lists/Layer');
const BasemapSchema = require('./lists/Basemap');

const PROJECT_NAME = 'imagineRio Narratives';
const adapterConfig = { mongoUri: process.env.MONGO_URI };

const keystone = new Keystone({
  adapter: new Adapter(adapterConfig),
  onConnect: process.env.CREATE_TABLES !== 'true' && initialiseData,
  cookieSecret: process.env.COOKIE_SECRET,
  sessionStore: new MongoStore({ url: process.env.MONGO_URI }),
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
keystone.createList('Layer', LayerSchema);
keystone.createList('Basemap', BasemapSchema);

module.exports = {
  keystone,
  apps: [
    new GraphQLApp({
      apollo: {
        introspection: true,
      },
    }),
    new AdminUIApp({
      name: PROJECT_NAME,
      enableDefaultRoute: false,
      authStrategy,
    }),
    new CheckAuthentication(),
    new S3Upload(),
    new NextApp({ dir: 'src' }),
  ],
  configureExpress: app => {
    app.set('trust proxy', true);
  },
};
