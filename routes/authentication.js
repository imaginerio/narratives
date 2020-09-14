/* eslint-disable class-methods-use-this */
const express = require('express');

module.exports = class CheckAuthentication {
  prepareMiddleware() {
    const middleware = express();
    middleware.get('/projects', (req, res, next) => {
      if (req.user) return next();
      return res.redirect('/login');
    });
    return middleware;
  }
};
