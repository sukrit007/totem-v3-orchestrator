/**
 * Entry point for orchestrator lambda function
 */
'use strict';

const
  logger = require('./common/logger'),
  constants = require('./common/constants'),
  bottle = constants.BOTTLE_CONTAINER,
  HttpStatus = require('http-status-codes'),
  glob = require('glob'),
  path = require('path');

// Load all modules (to ensure all bottle services are loaded)
glob.sync('./src/**/*.js').forEach(file => {
  require(path.resolve(file));
});

module.exports.createHandler = () => {
  //Setup common bottle services / values

  // Return the handler
  return (event, context, callback) => {
    logger.info(`GitHook: Begin: `, event, context);

    // API Gateway Events
    if(event.path) {
      let apiHandler = bottle.container[`api-${event.path}`];
      if(!apiHandler) {
        return callback(null, {
          statusCode: HttpStatus.NOT_FOUND,
          body: JSON.stringify({
            message: `Resource with path: ${event.path} is not found`
          })
        });
      }
      apiHandler.handle(event, context, callback);
    }

    // All other service events

    // Finally, throw error if no event handler found
    callback(new Error('No event handler registered for the given event type'));
  };
};