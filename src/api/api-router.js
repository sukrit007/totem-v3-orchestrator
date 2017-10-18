/**
 * Entry point for API Handler
 */
'use strict';

const
  constants = require('../common/constants'),
  HttpStatus = require('http-status-codes'),
  bottle = constants.BOTTLE_CONTAINER;

module.exports.handler = (event, context, callback) => {
  let apiHandler;

  // Check for Authorization Request
  if(event.type === 'REQUEST') {
    apiHandler = bottle.container['api-webhook-auth'];
  }
  else {
    // Try to lookup directly using path mapping
    apiHandler = bottle.container[`api-${event.path}`];
  }

  if(!apiHandler) {
    // Try custom registration
    if (event.path.match(/^.*setup$/)) {
      apiHandler = bottle.container['api-setup'];
    }

    if(!apiHandler) {
      return callback(null, {
        statusCode: HttpStatus.NOT_FOUND,
        body: JSON.stringify({
          message: `Resource with path: ${event.path} is not found`
        })
      });
    }
  }
  return apiHandler.handle(event, context, callback);

};