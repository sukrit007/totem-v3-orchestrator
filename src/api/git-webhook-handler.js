'use strict';

const
  constants = require('../common/constants'),
  HttpStatus = require('http-status-codes'),
  bottle = constants.BOTTLE_CONTAINER;

/**
 * Gitwebhook setup handler
 */
class GitWebhookHandler {

  constructor() {
  }

  handle(event, context, callback) {
    callback(null, {
      statusCode: HttpStatus.ACCEPTED,
      body: JSON.stringify({
        triage: {
          event: event,
          context: context
        }
      })
    });
  }
}

bottle.service('api-/hooks/github', GitWebhookHandler);

module.exports = GitWebhookHandler;