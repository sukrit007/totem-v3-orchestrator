'use strict';

const
  constants = require('../common/constants'),
  HttpStatus = require('http-status-codes'),
  apiError = require('./error'),
  error = require('../services/error'),
  _ = require('lodash'),
  config = require('config'),
  path = require('path'),
  uuid = require('uuid'),
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
    let body = JSON.parse(event.body);

    // We only consume PUSH events for now.  Rest are ignored with HTTP 204
    if(constants.HEADER_GITHUB_EVENT !== constants.GITHUB_EVENT_PUSH && !body.deleted) {
      return callback(null, {
        statusCode: HttpStatus.NO_CONTENT,
        body: '{}'
      });
    }
    let stateMachineInput = {
      branch: path.basename(body.ref),
      repo: body.repository.name,
      owner: body.repository.owner.name || body.repository.owner.login,
      commit: body.after,
      version: 'v1',
      jobId: uuid.v4(),
    };
    this.stepFunctions.startExecution({
      input: JSON.stringify(stateMachineInput),
      stateMachineArn: this.stateMachineConfig.arn,
      name: stateMachineInput.jobId
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