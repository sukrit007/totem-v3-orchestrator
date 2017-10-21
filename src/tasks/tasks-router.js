/**
 * Entry point for Step Functions Tasks Handler
 */
'use strict';

const
  constants = require('../common/constants'),
  error = require('../services/error'),
  bottle = constants.BOTTLE_CONTAINER;

module.exports.handler = (event, context, callback) => {
  event.parsedBody = JSON.parse(event.body || '{}');

  let taskEvent = event.parsedBody.event;

  let taskHandler = bottle.container[`tasks-event-${taskEvent}`];
  if(!taskHandler) {
    throw new error.EventHandlerNotRegistered();
  }
  return taskHandler.handle(event, context, callback);

};