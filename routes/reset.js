/* eslint-disable class-methods-use-this */
const express = require('express');
const { runCustomQuery } = require('@keystonejs/server-side-graphql-client');
const uuid = require('uuid').v4;

const { sendEmail } = require('../server/email');

module.exports = class ResetPassword {
  prepareMiddleware({ keystone }) {
    const middleware = express();
    middleware.post('/reset', (req, res) => {
      const { email } = req.body;
      return runCustomQuery({
        keystone,
        query: `query($email: String) {
          allUsers(where:{ email: $email }){
            id
            email
          }
        }`,
        variables: { email },
      }).then(queryResponse => {
        const resetToken = uuid();
        return runCustomQuery({
          keystone,
          query: `mutation UpdateResetToken($id: ID!, $resetToken: String) {
              updateUser(id: $id, data: { resetId: $resetToken }) {
                id
              }
            }`,
          variables: {
            id: queryResponse.allUsers[0].id,
            resetToken,
          },
        }).then(() => {
          sendEmail({
            to: email,
            key: resetToken,
            host: `${req.get('protocol') || 'http'}://${req.get('host')}`,
            template: 'reset-password',
          });

          res.send({ success: true });
        });
      });
    });

    return middleware;
  }
};
