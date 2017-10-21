/**
 * Entry point for Step Functions Tasks Handler
 */
'use strict';

const
  constants = require('../common/constants'),
  bottle = constants.BOTTLE_CONTAINER;

module.exports.handler = (event, context, callback) => {
  let taskHandler;

  // Try to lookup directly using path mapping
  return callback();

};