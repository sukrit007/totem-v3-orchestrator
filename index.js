'use strict';

const logger = require('./common/logger');

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