'use strict';

require('../../init');

const
  HttpStatus = require('http-status-codes'),
  githubFixture = require('./fixtures/github-fixture'),
  nock = require('nock'),
  handler = require('../../../index').handler;

const
  HOOK_LOCATION = 'https://api.github.com/repos/test-owner/test-repo/hooks/1',
  API_BASE = 'https://test-integration.execute-api.us-west-2.amazonaws.com/prod';

describe('Setup API', () => {

  afterEach(() => {
    nock.cleanAll();
  });

  describe('POST /setup', () => {

    it('should setup github repository with totem v3', done => {

      githubFixture.nockListHooks();
      githubFixture.nockCreateHook();

      let callback = (err, response) => {
        if(err) {
          return done(err);
        }
        try {
          response.statusCode.should.equals(HttpStatus.OK);
          let body = JSON.parse(response.body);
          body.should.deep.equals({
            location: HOOK_LOCATION,
            hookUrl: `${API_BASE}/hooks/github`
          });
        } catch (assertErr) {
          return done(assertErr);
        }
        return done();
      };

      let event = {
        path: '/setup',
        httpMethod: 'PUT',
        requestContext: {
          apiId: 'test-integration',
          stage: 'prod'
        },
        body: JSON.stringify({
          owner: githubFixture.DATA.TEST_OWNER,
          repo: githubFixture.DATA.TEST_REPO
        })
      };

      let context = {};

      handler(event, context, callback);

    });


    it('should update existing setup for totem v3', done => {

      githubFixture.nockListHooksWithExistingHook(API_BASE);
      githubFixture.nockUpdateHook();

      let callback = (err, response) => {
        if(err) {
          return done(err);
        }
        try {
          response.statusCode.should.equals(HttpStatus.OK);
          let body = JSON.parse(response.body);
          body.should.deep.equals({
            location: HOOK_LOCATION,
            hookUrl: `${API_BASE}/hooks/github`
          });
        } catch (assertErr) {
          return done(assertErr);
        }
        return done();
      };

      let event = {
        path: '/setup',
        httpMethod: 'PUT',
        requestContext: {
          apiId: 'test-integration',
          stage: 'prod'
        },
        body: JSON.stringify({
          owner: githubFixture.DATA.TEST_OWNER,
          repo: githubFixture.DATA.TEST_REPO
        })
      };

      let context = {};

      handler(event, context, callback);

    });
  });

});