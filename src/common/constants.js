/**
 * Common constants
 */
'use strict';

const Bottle = require('bottlejs');

exports = module.exports = {
  BOTTLE_CONTAINER_NAME: 'default',
  BOTTLE_CONTAINER: Bottle.pop(exports.BOTTLE_CONTAINER_NAME),

  HEADER_HUB_SIGNATURE: 'X-Hub-Signature',
  HEADER_GITHUB_EVENT: 'X-GitHub-Event',
  ERROR_CODE_UNAUTHORIZED: 'Unauthorized',

  GITHUB_EVENT_PUSH: 'push'
};