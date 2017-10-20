'use strict';

const
  constants = require('../common/constants'),
  HttpStatus = require('http-status-codes'),
  apiError = require('./error'),
  error = require('../services/error'),
  _ = require('lodash'),
  config = require('config'),
  bottle = constants.BOTTLE_CONTAINER;

/**
 * Gitwebhook setup handler
 */
class GitWebhookHandler {

  constructor(githubService, stepFunctions, stateMachineConfig) {
    this.githubService = githubService;
    this.stepFunctions = stepFunctions;
    this.stateMachineConfig = _.merge({}, config.gitHookStateMachine, stateMachineConfig);
  }

  handle(event, context, callback) {
    let headers = event.headers || {};
    let signature = headers[constants.HEADER_HUB_SIGNATURE];
    if(!signature || !this.githubService.validateHookSignature(event.body, signature)) {
      return apiError.handleError(new error.WebhookUnauthorized(), callback);
    }
    this.stepfunctions.startExecution({
      input: event.body,
      stateMachineArn: this.stateMachineConfig.arn
    }).promise()
      .then(data => {
        return callback(null, {
          statusCode: HttpStatus.ACCEPTED,
          body: JSON.stringify(data)
        });
      })
      .catch(err => apiError.handleError(err, callback));

  }
}

bottle.service('api-/hooks/github', GitWebhookHandler, 'github', 'stepFunctions');

module.exports = GitWebhookHandler;