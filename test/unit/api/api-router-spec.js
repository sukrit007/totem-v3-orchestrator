'use strict';

require('../../init');

const
  HttpStatus = require('http-status-codes'),
  apiRouter = require('../../../src/api/api-router');

describe('App Handler', () => {

  let handler;

  beforeEach(() => {
    handler = apiRouter.handler;
  });

  it('should return NOT_FOUND response for unmapped response', done => {
    let callback = (err, response) => {
      if(err) {
        return done(err);
      }
      response.statusCode.should.equals(HttpStatus.NOT_FOUND);
      return done();
    };

    let
      event = {
        path: '/invalidpath'
      },
      context = {};

    handler(event, context, callback);

  });

});