'use strict';

const
  constants = require('../common/constants'),
  pkg = require('../../package.json'),
  HttpStatus = require('http-status-codes'),
  bottle = constants.BOTTLE_CONTAINER;

/**
 * Root API Handler
 */
class RootApiHandler {

  constructor() {}

  handle(event, context, callback) {
    callback(null, {
      statusCode: HttpStatus.OK,
      body: JSON.stringify({
        name: pkg.name,
        version: pkg.version,
        triage: {
          event: event,
          context: context
        }
      })
    });
  }
}

bottle.service('api-/', RootApiHandler);

module.exports = RootApiHandler;