'use strict';

const
  constants = require('../common/constants'),
  HttpStatus = require('http-status-codes'),
  bottle = constants.BOTTLE_CONTAINER;

/**
 * Gitwebhook setup handler
 */
class SetupApiHandler {

  constructor(githubService) {
    this.githubService = githubService;
  }

  handle(event, context, callback) {
    callback(null, {
      statusCode: HttpStatus.NO_CONTENT
    });
  }
}

bottle.service('api-/setup', SetupApiHandler, 'github');

module.exports = SetupApiHandler;