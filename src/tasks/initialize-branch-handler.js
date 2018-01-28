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
    return callback(null, {
      event: 'initialized-branch'
    });
  }
}

bottle.service('tasks-initialize-branch', InitializeBranchHandler);

module.exports = InitializeBranchHandler;