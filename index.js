/**
 * Entry point for orchestrator lambda function
 */
'use strict';

const logger = require('./src/common/logger');


module.exports.handler = (event, context, callback) => {
  logger.info(`GitHook: Begin: `, event, context);

  callback(null, {
    statusCode: 202,
    body: JSON.stringify({
      event: event,
      context: context
    })
  });

};