/**
 * Task for setting up pipeline
 */
'use strict';

const
  constants = require('../common/constants'),
  bottle = constants.BOTTLE_CONTAINER;

class SetupPipelineHandler {

  constructor() {}

  handle(event, context, callback) {
    return callback(null, JSON.stringify({
      event: 'setup-success'
    }));
  }
}

bottle.service('tasks-event-initialized-branch', SetupPipelineHandler);

module.exports = SetupPipelineHandler;