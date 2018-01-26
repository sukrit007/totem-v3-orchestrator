'use strict';

require('../../init');

const
  HttpStatus = require('http-status-codes'),
  pkg = require('../../../package.json'),
  handler = require('../../../index').handler;

describe('Root API', () => {

  describe('GET /', () => {

    it('should return ROOT API response', done => {
      let callback = (err, response) => {
        if(err) {
          return done(err);
        }
        try {
          response.statusCode.should.equals(HttpStatus.OK);
          let body = JSON.parse(response.body);
          body.should.deep.equals({
            name: pkg.name,
            version: pkg.version,
            triage: {
              event,
              context
            }
          });
        } catch (assertErr) {
          return done(assertErr);
        }

        return done();
      };

      let event = {
        path: '/',
        httpMethod: 'GET'
      };

      let context = {};

      handler(event, context, callback);

    });

  });

});