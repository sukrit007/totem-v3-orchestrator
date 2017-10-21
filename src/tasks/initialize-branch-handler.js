/**
 * Task for initializing git branch/tag
 */
'use strict';

const
  constants = require('../common/constants'),
  bottle = constants.BOTTLE_CONTAINER;

class InitializeBranchHandler {

  constructor() {}

  handle(event, context, callback) {
    return callback(null, JSON.stringify({
      event: 'initialized-branch'
    }));
  }
}

bottle.service('tasks-event-incoming-hook', InitializeBranchHandler);

module.exports = InitializeBranchHandler;