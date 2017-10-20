/* jshint ignore:start */
/**
 * Custom API Gateway Authentication handler for authorizing Git Webhook Handler
 * See http://docs.aws.amazon.com/apigateway/latest/developerguide/use-custom-authorizer.html#api-gateway-custom-authorizer-types
 * and https://developer.github.com/webhooks/securing/#validating-payloads-from-github
 */
/* jshint ignore:end */
'use strict';

const
  constants = require('../common/constants'),
  bottle = constants.BOTTLE_CONTAINER;

/**
 * Handler for authorizing git webhooks
 */
class WebHookAuthHandler {

  constructor(githubService) {
    this.githubService = githubService;
  }

  handle(event, context, callback) {
    let headers = event.headers;
    let signature = headers[constants.HEADER_HUB_SIGNATURE];
    if(!signature || this.githubService.validateHookSignature()) {
      return callback(constants.ERROR_CODE_UNAUTHORIZED);
    }
    return callback(null, {
      principalId: 'github',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: event.methodArn
          }
        ]
      }
    });
  }

}

bottle.service('api-webhook-auth', WebHookAuthHandler, 'github');

module.exports = WebHookAuthHandler;