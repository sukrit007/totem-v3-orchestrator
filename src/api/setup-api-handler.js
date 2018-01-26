'use strict';

const
  constants = require('../common/constants'),
  HttpStatus = require('http-status-codes'),
  _ = require('lodash'),
  config = require('config'),
  apiError = require('./error'),
  bottle = constants.BOTTLE_CONTAINER;

/**
 * Gitwebhook setup handler
 */
class SetupApiHandler {

  constructor(githubService, awsConfig) {
    this.githubService = githubService;
    this.awsConfig = _.merge({}, config.aws, awsConfig);
  }

  handle(event, context, callback) {

    let body = event.body && JSON.parse(event.body) || {};
    body = _.merge({}, body, {
      repo: event.pathParameters.repo,
      owner: event.pathParameters.owner
    });
    let apiId = event.requestContext.apiId || 'local',
      stage = event.requestContext.stage || 'prod',
      apiUrl = body.apiUrl || `https://${apiId}.execute-api.${this.awsConfig.region}.amazonaws.com/${stage}`;

    return this.githubService.setupWebhook(body.owner, body.repo, apiUrl)
      .then( output => {
        return callback(null, {
          statusCode: HttpStatus.OK,
          body: JSON.stringify(output)
        });
      })
      .catch(err => apiError.handleError(err, callback));

  }
}

bottle.service('api-setup', SetupApiHandler, 'github');

module.exports = SetupApiHandler;