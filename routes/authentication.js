/* eslint-disable class-methods-use-this */
const express = require('express');

module.exports = class CheckAuthentication {
  prepareMiddleware() {
    const middleware = express();
    middleware.get(
      ['/projects', '/create', '/edit/*', '/duplicate/*', '/download'],
      (req, res, next) => {
        if (req.user && req.user.verified) return next();
        return res.redirect(`/login?redirect=${req.originalUrl}`);
      }
    );

    middleware.get('/login', (req, res, next) => {
      if (req.user && req.user.verified) {
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
