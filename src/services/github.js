'use strict';

const
  config = require('config'),
  constants = require('../common/constants'),
  bottle = constants.BOTTLE_CONTAINER,
  _ = require('lodash');

/**
 * Github Wrapper service that abstract calls to github
 */
class GithubService {

  /**
   * Initialize GithubService
   * @param {object}[githubConfig] - Optional github config. If not present, it is read from config module.
   * @param {string}[githubConfig.token] - GIthub personal access token used for interacting with github
   */
  constructor(githubConfig) {
    this.githubConfig = _.merge({}, config.github, githubConfig);
  }

  setupWebhook() {

  }

  /**
   * Lists all hooks for given owner and repository
   * @param owner
   * @param repo
   */
  listWebhooks(owner, repo) {

  }


}

bottle.service('github', GithubService);

module.exports = GithubService;