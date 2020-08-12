const express = require('express');
const bodyParser = require('body-parser');
const { getItems } = require('@keystonejs/server-side-graphql-client');

class SessionAuth {
  constructor(keystone) {
    this.keystone = keystone;
    this.signin = this.signin.bind(this);
    this.signout = this.signout.bind(this);
  }

  prepareMiddleware() {
    const app = express();
    app.use(bodyParser.urlencoded({ extended: true }));
    app.post('/admin/api/signin', this.signin);
    app.post('/admin/api/signout', this.signout);
    app.post('/admin/api', this.checkAuth);
    app.get('/', this.checkAuth);
    return app;
  }

  async signin(req, res) {
    if (!req.body.email || !req.body.password) return res.json({ success: false });

    const user = await getItems({
      keystone: this.keystone,
      listKey: 'User',
      where: { email: req.body.email },
      returnFields: 'id, name, email, password',
    });

    if (!user) {
      return res.json({
        success: false,
        session: false,
        message: 'Sorry, there was an issue signing you in, please try again.',
      });
    }

    return this.keystone.session.signin(
      { email: user.email, password: req.body.password },
      req,
      res,
      // eslint-disable-next-line no-shadow
      user => {
        return res.json({
          success: true,
          session: true,
          date: new Date().getTime(),
          userId: user.id,
        });
      },
      // eslint-disable-next-line no-shadow
      err => {
        return res.json({
          success: true,
          session: false,
          message:
            (err && err.message ? err.message : false) ||
            'Sorry, there was an issue signing you in, please try again.',
        });
      }
    );
  }

  signout(req, res) {
    this.keystone.session.signout(req, res, () => {
      res.json({ signedout: true });
    });
  }

  // eslint-disable-next-line class-methods-use-this
  checkAuth(req, res, next) {
    // you could check user permissions here too
    if (req.user) return next();
    return res.status(403).json({ error: 'no access' });
  }
}

module.exports = { SessionAuth };
