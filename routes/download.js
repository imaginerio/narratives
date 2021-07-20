/* eslint-disable class-methods-use-this */
const express = require('express');
const { runCustomQuery } = require('@keystonejs/server-side-graphql-client');

module.exports = class DownloadData {
  prepareMiddleware({ keystone }) {
    const middleware = express();
    middleware.get('/download', (req, res) =>
      runCustomQuery({
        keystone,
        query: `query DownloadData($id: ID!) {
          User(where: { id: $id }){
            name
            email
            projects{
              title
              description
              tags {
                name
              }
              category
              imageTitle
              source
              url
              slides{
                title
                description
                order
                size
                year
                longitude
                latitude
                zoom
                bearing
                pitch
                selectedFeature
                layers {
                  title
                }
                basemap{
                  ssid
                  title
                  firstYear
                  lastYear
                  longitude
                  latitude
                  creator
                }
                opacity
                media
                imageTitle
                source
                url
                annotations{
                  feature
                }
              }
            }
          }
        }`,
        variables: {
          id: req.user.id,
        },
      }).then(async data => {
        res.set({ 'Content-Disposition': 'attachment; filename="narratives_data.json"' });
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(data, null, 2));
      })
    );

    return middleware;
  }
};
