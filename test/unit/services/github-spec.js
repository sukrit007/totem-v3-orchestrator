'use strict';

require('../../init');

const
  sinon = require('sinon'),
  HttpStatus = require('http-status-codes'),
  error = require('../../../src/services/error'),
  GithubService = require('../../../src/services/github');

const
  MOCK_API_URL = 'https://mock-api-url',
  MOCK_REPO = 'mock-repo',
  MOCK_HOOK_ID = 123458,
  MOCK_OWNER = 'mock-owner',
  MOCK_HOOK_SECRET = 'mock-secret',
  MOCK_GITHUB_HOOK_URL = 'https://mock-github-webhook-url';

describe('GithubService', () => {

  let service, githubApi, hubRepo;

  beforeEach(() => {
    githubApi = {
      getRepo: sinon.stub()
    };

    hubRepo = {
      listHooks: sinon.stub(),
      updateHook: sinon.stub(),
      createHook: sinon.stub()
    };


    service = new GithubService(githubApi, {
      config: {
        secret: MOCK_HOOK_SECRET
      }
    });
  });

  describe('setupWebhook', () => {

    it('should create new webhook for the repository', () => {

      // Setup Mocks
      hubRepo.listHooks.returns(Promise.resolve({
        data: []
      }));
      hubRepo.createHook.returns(Promise.resolve({
        data: {
          url: MOCK_GITHUB_HOOK_URL,
          id: MOCK_HOOK_ID
        }
      }));
      githubApi.getRepo.returns(hubRepo);

      // Test
      return service.setupWebhook(MOCK_OWNER, MOCK_REPO, MOCK_API_URL)
        .then(output => {
          // Assertions
          output.should.deep.equals({
            location: MOCK_GITHUB_HOOK_URL,
            hookUrl: `${MOCK_API_URL}/hooks/github`,
            hookId: MOCK_HOOK_ID
          });

          hubRepo.listHooks.should.have.been.calledWithExactly();
          hubRepo.createHook.should.have.been.calledWithExactly({
            active: true,
            name: 'web',
            type: 'Repository',
            config: {
              'content_type': 'application/json',
              'insecure_ssl': 0,
              url: `${MOCK_API_URL}/hooks/github`,
              secret: MOCK_HOOK_SECRET
            },
            events: ['create', 'delete', 'push'],
          });
          hubRepo.updateHook.should.not.have.been.called;

        });
    });

    it('should update existing webhook for the repository', () => {

      // Setup Mocks
      hubRepo.listHooks.returns(Promise.resolve({
        data: [{
          id: MOCK_HOOK_ID,
          config: {
            url: `${MOCK_API_URL}/hooks/github`,
          }
        }]
      }));
      hubRepo.updateHook.returns(Promise.resolve({
        data: {
          url: MOCK_GITHUB_HOOK_URL,
          id: MOCK_HOOK_ID
        }
      }));
      githubApi.getRepo.returns(hubRepo);

      // Test
      return service.setupWebhook(MOCK_OWNER, MOCK_REPO, MOCK_API_URL)
        .then(output => {
          // Assertions
          output.should.deep.equals({
            location: MOCK_GITHUB_HOOK_URL,
            hookUrl: `${MOCK_API_URL}/hooks/github`,
            hookId: MOCK_HOOK_ID
          });

          hubRepo.updateHook.should.have.been.calledWithExactly(MOCK_HOOK_ID, {
            active: true,
            name: 'web',
            type: 'Repository',
            config: {
              'content_type': 'application/json',
              'insecure_ssl': 0,
              url: `${MOCK_API_URL}/hooks/github`,
              secret: MOCK_HOOK_SECRET
            },
            events: ['create', 'delete', 'push'],
          });
          hubRepo.createHook.should.not.have.been.called;

        });
    });

    it('should throw GitRepoNotFound when github repository is not found', () => {
      let err = new Error();
      err.response = {
        status: HttpStatus.NOT_FOUND
      };
      hubRepo.listHooks.returns(Promise.reject(err));
      githubApi.getRepo.returns(hubRepo);
      // Test
      return service.setupWebhook(MOCK_OWNER, MOCK_REPO, MOCK_API_URL)
        .should.eventually.be.rejectedWith(error.GitRepoNotFound);
    });

    it('should rethrow unhandled errors', () => {
      let err = new Error();
      hubRepo.listHooks.returns(Promise.reject(err));
      githubApi.getRepo.returns(hubRepo);
      // Test
      return service.setupWebhook(MOCK_OWNER, MOCK_REPO, MOCK_API_URL)
        .should.eventually.be.rejectedWith(err);
    });

  });

});