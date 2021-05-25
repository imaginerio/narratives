/* eslint-disable class-methods-use-this */
const express = require('express');
const { runCustomQuery, createItem } = require('@keystonejs/server-side-graphql-client');

module.exports = class CheckAuthentication {
  prepareMiddleware({ keystone }) {
    const middleware = express();
    middleware.get('/duplicate/:id', (req, res) =>
      runCustomQuery({
        keystone,
        query: `query GetAllSlide($slide: ID!){
          Slide(where: {id: $slide}){
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
            layers{
              id
            }
            basemap{
              id
            }
            opacity
            media
            imageTitle
            source
            url
            project {
              id
            }
            annotations{
              feature
            }
          }
        }`,
        variables: {
          slide: req.params.id,
        },
      }).then(async data => {
        const { Slide } = data;

        Slide.title = `${Slide.title} copy`;
        if (Slide.layers) Slide.layers = { connect: Slide.layers };
        if (Slide.basemap) Slide.basemap = { connect: Slide.basemap };
        if (Slide.project) Slide.project = { connect: Slide.project };
        if (Slide.annotations) Slide.annotations = { create: Slide.annotations };

        return createItem({
          keystone,
          listKey: 'Slide',
          item: Slide,
        }).then(newSlide => res.send(newSlide));
      })
    );

    return middleware;
  }
};
