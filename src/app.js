/**
 * Entry point for orchestrator lambda function
 */
'use strict';

const
  logger = require('./common/logger'),
  constants = require('./common/constants'),
  bottle = constants.BOTTLE_CONTAINER,
  apiRouter = require('./api/api-router'),
  error = require('./services/error'),
  glob = require('glob'),
  config = require('config'),
  GitHub = require('github-api'),
  _ = require('lodash'),
  AWS = require('aws-sdk'),
  path = require('path');

// Load all modules (to ensure all bottle services are loaded)
glob.sync('./src/**/*.js').forEach(file => {
  require(path.resolve(file));
});

module.exports.createHandler = () => {
  //Setup common bottle services / values

  bottle.value('githubApi', new GitHub({
    token: config.github.token
  }));

  bottle.value('stepFunctions', new AWS.StepFunctions(_.merge({}, config.aws)));

  // Return the handler
  return (event, context, callback) => {
    logger.info(`GitHook: Begin: `, event, context);

    // API Gateway Events
    if(event.path) {
      return apiRouter.handler(event, context, callback);
    }

    // All other service events

    // Finally, throw error if no event handler found
    callback(new error.EventHandlerNotRegistered());
  };
};