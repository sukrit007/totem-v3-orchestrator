'use strict';

require('../init');

const
  HttpStatus = require('http-status-codes'),
  pkg = require('../../package.json'),
  error = require('../../src/services/error'),
  should = require('chai').should(),
  app = require('../../src/app');

describe('App Handler', () => {

  let handler;

  beforeEach(() => {
    handler = app.createHandler();
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

  it('should return EventHandlerNotRegistered error when no event handler is registered for the event', done => {
    let callback = err => {
      should.exist(err);
      err.should.be.instanceof(error.EventHandlerNotRegistered);
      return done();
    };

    let
      event = {},
      context = {};

    handler(event, context, callback);

  });

});