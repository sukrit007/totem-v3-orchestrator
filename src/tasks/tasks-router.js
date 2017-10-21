/**
 * Entry point for Step Functions Tasks Handler
 */
'use strict';

const
  constants = require('../common/constants'),
  error = require('../services/error'),
  logger = require('../common/logger'),
  bottle = constants.BOTTLE_CONTAINER;

module.exports.handler = (event, context, callback) => {

  let taskEvent = event.event;

  logger.info(`TaskRouter: Handle event(${taskEvent}`);
  let taskHandler = bottle.container[`tasks-event-${taskEvent}`];
  if(!taskHandler) {
    throw new error.EventHandlerNotRegistered();
  }
  return taskHandler.handle(event, context, callback);

};