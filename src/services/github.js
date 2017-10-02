'use strict';

const
  config = require('config'),
  constants = require('../common/constants'),
  logger = require('../common/logger'),
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
   * @param {GitHub} [hookDef] - Hook definition
   */
  constructor(githubApi, hookDef) {
    this.githubApi = githubApi;
    this.hookDef = _.merge({}, config.github.hookDef, hookDef);
  }

  setupWebhook(owner, repo, apiUrl) {
    let hubRepo = this.githubApi.getRepo(owner, repo);
    let hookUrl =  `${apiUrl}/hooks/github`;
    logger.info(`Configuring webhook for ${owner}/${repo} using apiUrl:${apiUrl}`);
    return hubRepo.listHooks()
      .then(resp => {
        let hooks = resp.data;
        return _.find(hooks, hook => {
          return hook.config && hook.config.url && hook.config.url.toLowerCase().startsWith(apiUrl);
        });
      })
      .then(hook => {
        let newHook = _.merge({}, this.hookDef, {
          config: {
            url: hookUrl
          }
        });
        if(hook) {
          logger.info(`Updating existing webhook for ${owner}/${repo} with id: ${hook.id}`);
          return hubRepo.updateHook(hook.id, newHook);
        } else {
          logger.info(`Creating new webhook for ${owner}/${repo}`);
          return hubRepo.createHook(newHook);
        }
      })
      .then(resp => {
        return {
          location: resp.data.url,
          hookUrl: hookUrl
        };
      })
      .catch(err => {
        if(err.response) {
          if(err.response.status === HttpStatus.NOT_FOUND) {
            throw new error.GitRepoNotFound(owner, repo);
          }
        }
        throw err;
      });
  }

}

bottle.service('github', GithubService, 'githubApi');

module.exports = GithubService;