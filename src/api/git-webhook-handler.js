'use strict';

const
  constants = require('../common/constants'),
  HttpStatus = require('http-status-codes'),
  apiError = require('./error'),
  error = require('../services/error'),
  bottle = constants.BOTTLE_CONTAINER;

/**
 * Gitwebhook setup handler
 */
class GitWebhookHandler {

  constructor(githubService) {
    this.githubService = githubService;
  }

  handle(event, context, callback) {
    let headers = event.headers || {};
    let signature = headers[constants.HEADER_HUB_SIGNATURE];
    if(!signature || !this.githubService.validateHookSignature(event.body, signature)) {
      return apiError.handleError(new error.WebhookUnauthorized(), callback);
    }
    return callback(null, {
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

bottle.service('api-/hooks/github', GitWebhookHandler, 'github');

module.exports = GitWebhookHandler;