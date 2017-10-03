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
        return done();
      };

      let event = {
        path: '/'
      };

      let context = {};

      handler(event, context, callback);

    });

  });

});