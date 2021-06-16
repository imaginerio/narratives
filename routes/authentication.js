/* eslint-disable class-methods-use-this */
const express = require('express');

module.exports = class CheckAuthentication {
  prepareMiddleware() {
    const middleware = express();
    middleware.get(['/projects', '/create', '/edit/*', '/duplicate/*'], (req, res, next) => {
      if (req.user) return next();
      return res.redirect(`/login?redirect=${req.originalUrl}`);
    });

    middleware.get('/login', (req, res, next) => {
      if (req.user) {
        if (req.query.redirect) {
          const { redirect } = req.query;
          return res.redirect(redirect);
        }
        return res.redirect('/projects');
      }
      return next();
    });
    return middleware;
  }
};
