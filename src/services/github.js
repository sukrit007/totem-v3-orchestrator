'use strict';

const
  config = require('config'),
  constants = require('../common/constants'),
  bottle = constants.BOTTLE_CONTAINER,
  HttpStatus = require('http-status-codes'),
  error = require('./error'),
  _ = require('lodash');

/**
 * Github Wrapper service that abstract calls to github
 */
class GithubService {

  /**
   * Initialize GithubService
   * @param {GitHub} githubApi - GitHub API Instance
   */
  constructor(githubApi) {
    this.githubApi = githubApi;
  }

  setupWebhook(owner, repo) {
    return this.githubApi.getRepo(owner, repo)
      .listHooks()
      .catch(err => {
        if(err.response) {
          if(err.response.status === HttpStatus.NOT_FOUND) {
            throw new error.GitRepoNotFound(owner, repo);
          }
        }
        throw err;
      });
  }

  /**
   * Lists all hooks for given owner and repository
   * @param owner
   * @param repo
   */
  listWebhooks(owner, repo) {

  }


}

bottle.service('github', GithubService, 'githubApi');

module.exports = GithubService;