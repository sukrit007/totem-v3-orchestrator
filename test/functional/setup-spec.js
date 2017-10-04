'use strict';

require('../init');

const
  config = require('config'),
  request = require('supertest'),
  HttpStatus = require('http-status-codes'),
  GitHub = require('github-api'),
  AWS = require('aws-sdk'),
  aws4 = require('aws4'),
  should = require('chai').should();

const TEST_TIMEOUT = 10000;



describe('Repository Setup', () => {
  let orchestratorApiId, testRepo, testOwner, testBranch, githubToken, awsCreds, awsRegion;

  before(() => {
    should.exist(config.tests, 'Tests config not found');
    should.exist(config.tests.functional, 'Functional Tests config not found');
    should.exist(config.tests.functional.orchestratorApiId, 'Orchestrator URL not found in functional tests config');
    should.exist(config.tests.functional.github, 'Github config not found');
    should.exist(config.tests.functional.github.testRepo, 'Test repository not defined');
    should.exist(config.tests.functional.github.testOwner, 'Test owner not defined');
    should.exist(config.tests.functional.github.testBranch, 'Test branch not defined');
    should.exist(config.tests.functional.github.token, 'Github token not defined');
    should.exist(config.aws.region, 'AWS Region not set');


    orchestratorApiId = config.tests.functional.orchestratorApiId;
    testRepo = config.tests.functional.github.testRepo;
    testOwner = config.tests.functional.github.testOwner;
    testBranch = config.tests.functional.github.testBranch;
    githubToken = config.tests.functional.github.token;
    awsRegion = config.aws.region;
    let githubApi = new GitHub({
      token: githubToken
    });

    return new AWS.CredentialProviderChain().resolvePromise()
      .then(creds => awsCreds = creds)
      .then(() => {
        should.exist(awsCreds.accessKeyId, 'AWS Access Key not set');
        should.exist(awsCreds.secretAccessKey, 'AWS Secret Key not set');
      });
  });

  it('should configure my repository with github', done => {

    let opts = aws4.sign({
      host: `${orchestratorApiId}.execute-api.${awsRegion}.amazonaws.com`,
      region: awsRegion,
      service: 'execute-api',
      method: 'GET',
      path: `/prod/owners/${testOwner}/repos/${testRepo}/setup`,
      body: JSON.stringify({})
    }, awsCreds);

    request(`https://${opts.host}`)
      .put(opts.path)
      .set(opts.headers)
      .send(opts.body)
      .expect(HttpStatus.OK)
      .expect('Content-Type', /json/)
      .expect(res => {
        should.exist(res.body);
        should.exist(res.body.location);
      })
      .end((err, res) => {
        console.info('Setup API Response: ',res.body);
        if(err) {
          return done(err);
        }
      });
  }).timeout(TEST_TIMEOUT);

});
