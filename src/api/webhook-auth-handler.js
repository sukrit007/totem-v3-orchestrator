/**
 * Custom API Gateway Authentication handler for authorizing Git Webhook Handler
 * See http://docs.aws.amazon.com/apigateway/latest/developerguide/use-custom-authorizer.html#api-gateway-custom-authorizer-types
 * and https://developer.github.com/webhooks/securing/#validating-payloads-from-github
 */
'use strict';

const
  constants = require('../common/constants'),
  bottle = constants.BOTTLE_CONTAINER;

class WebHookAuthHandler {

  constructor(githubService) {
    this.githubService = githubService;
  }

  handle(event, context, callback) {
    let signature = event.authorizationToken;
    if(!signature) {
      return callback('Unauthorized');
    }
    return callback(null, {
      type: 'TOKEN',
      authorizationToken: 'allow',
      methodArn: event.methodArn
    });
  }

};

bottle.service('api-webhook-auth', WebHookAuthHandler, 'github');

module.exports = WebHookAuthHandler;