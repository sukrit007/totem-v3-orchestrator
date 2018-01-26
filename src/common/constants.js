/**
 * Common constants
 */
'use strict';

const Bottle = require('bottlejs');

exports = module.exports = {
  BOTTLE_CONTAINER_NAME: 'default',
  BOTTLE_CONTAINER: Bottle.pop(exports.BOTTLE_CONTAINER_NAME)
};