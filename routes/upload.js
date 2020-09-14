/* eslint-disable class-methods-use-this */
require('dotenv-safe').config();
const express = require('express');
const bodyParser = require('body-parser');
const aws = require('aws-sdk');
const uuid = require('uuid').v4;

const s3 = new aws.S3();

module.exports = class S3Upload {
  prepareMiddleware() {
    const middleware = express();
    middleware.use(bodyParser.json());
    middleware.post('/upload', (req, res) => {
      const { name, type } = req.body;
      const bucket = process.env.S3_BUCKET;
      const fileName = `${req.user.id}/${uuid()}-${name}`;
      const s3Params = {
        Bucket: bucket,
        Key: fileName,
        Expires: 600,
        ContentType: type,
      };

      s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        }
        const returnData = {
          signedRequest: data,
          url: `https://${bucket}.s3.amazonaws.com/${fileName}`,
        };
        res.write(JSON.stringify(returnData));
        return res.end();
      });
    });
    return middleware;
  }
};
