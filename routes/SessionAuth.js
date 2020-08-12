const express = require('express');

class SessionAuth {
  constructor(keystone) {
    this.keystone = keystone;
  }

  prepareMiddleware() {
    const app = express();
    app.post('/admin/api/signin', this.signin);
    app.post('/admin/api/signout', this.signout);
    app.post('/admin/api', this.checkAuth);
    app.get('/', this.checkAuth);
    return app;
  }

  signin(req, res) {
    if (!req.body.username || !req.body.password) return res.json({ success: false });

    return this.keystone
      .list('User')
      .model.findOne({ email: req.body.username })
      .exec((err, user) => {
        if (err || !user) {
          return res.json({
            success: false,
            session: false,
            message:
              (err && err.message ? err.message : false) ||
              'Sorry, there was an issue signing you in, please try again.',
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
      });
  }

  // you'll want one for signout too
  signout(req, res) {
    this.keystone.session.signout(req, res, () => {
      res.json({ signedout: true });
    });
  }

  // also create some middleware that checks the current user

  // as long as you're using Keystone's session management, the user
  // will already be loaded if there is a valid current session

  // eslint-disable-next-line class-methods-use-this
  checkAuth(req, res, next) {
    // you could check user permissions here too
    if (req.user) return next();
    return res.status(403).json({ error: 'no access' });
  }
}

module.exports = { SessionAuth };
