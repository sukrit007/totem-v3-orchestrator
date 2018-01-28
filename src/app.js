/**
 * Entry point for orchestrator lambda function
 */
'use strict';

const
  logger = require('./common/logger'),
  constants = require('./common/constants'),
  bottle = constants.BOTTLE_CONTAINER,
  apiRouter = require('./api/api-router'),
  tasksRouter = require('./tasks/tasks-router'),
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

function registerCommonServices() {
  bottle.value('githubApi', new GitHub({
    token: config.github.token
  }));
  bottle.value('stepFunctions', new AWS.StepFunctions(_.merge({}, config.aws)));
}

function createTask(taskName) {
  //Setup common bottle services / values
  registerCommonServices();

  // Return the handler
  return (event, context, callback) => {
    logger.info(`Step Function: ${taskName} Task Begin: `, event, context);

    let taskHandler = bottle.container[`tasks-${taskName}`];
    if(!taskHandler) {
      throw new error.EventHandlerNotRegistered();
    }
    return taskHandler.handle(event, context, callback);
  };
}

module.exports = {

  createRoutesHandler: () => {
    //Setup common bottle services / values
    registerCommonServices();


    // Return the handler
    return (event, context, callback) => {
      logger.info(`Routes: Begin: `, event, context);

      // API Gateway Events
      if(event.path) {
        return apiRouter.handler(event, context, callback);
      }
      // Finally, throw error if no event handler found
      callback(new error.EventHandlerNotRegistered());
    };
  },

  initializeBranchTask: () => createTask('initialize-branch'),
  setupPipelineTask: () => createTask('setup-pipeline'),

};