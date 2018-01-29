'use strict';

require('../init');

const
  error = require('../../src/services/error'),
  should = require('chai').should(),
  app = require('../../src/app');

describe('App Handler', () => {

  let handler;

  beforeEach(() => {
    handler = app.createRoutesHandler();
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