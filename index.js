/* eslint-disable class-methods-use-this */
const express = require('express');
const { Keystone } = require('@keystonejs/keystone');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const { NextApp } = require('@keystonejs/app-next');
const { MongooseAdapter: Adapter } = require('@keystonejs/adapter-mongoose');
const initialiseData = require('./initial-data');

const UserSchema = require('./lists/User');
const ProjectSchema = require('./lists/Project');
const SlideSchema = require('./lists/Slide');
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
keystone.createList('Project', ProjectSchema);
keystone.createList('Tag', TagSchema);

class CheckAuthentication {
  prepareMiddleware() {
    const middleware = express();
    middleware.get('/projects', (req, res, next) => {
      if (req.user) return next();
      return res.redirect('/login');
    });
    return middleware;
  }
}

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
    new NextApp({ dir: 'src' }),
  ],
};
