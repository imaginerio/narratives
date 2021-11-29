/* eslint-disable class-methods-use-this */
const express = require('express');
const { runCustomQuery } = require('@keystonejs/server-side-graphql-client');

module.exports = class ChangePassword {
  prepareMiddleware({ keystone }) {
    const middleware = express();
    middleware.post('/password', (req, res) => {
      const { key, password } = req.body;
      return runCustomQuery({
        keystone,
        query: `query($key: String) {
          allUsers(where:{ resetId: $key }){
            id
            email
          }
        }`,
        variables: { key },
      }).then(queryResponse => {
        return runCustomQuery({
          keystone,
          query: `mutation UpdatePassword($id: ID!, $password: String) {
              updateUser(id: $id, data: { password: $password, resetId: null }) {
                id
              }
            }`,
          variables: {
            id: queryResponse.allUsers[0].id,
            password,
          },
        }).then(() => {
          res.send({ success: true });
        });
      });
    });

    return middleware;
  }
};
