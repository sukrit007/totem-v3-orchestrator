# totem-v3-orchestrator [![Coverage Status](https://coveralls.io/repos/github/totem/totem-v3-orchestrator/badge.svg?branch=feature_git-workflow)](https://coveralls.io/github/totem/totem-v3-orchestrator?branch=feature_git-workflow) [![Build Status](https://travis-ci.org/totem/totem-v3-orchestrator.svg?branch=feature_git-workflow)](https://travis-ci.org/totem/totem-v3-orchestrator)
Manages the lifecycle for building, deploying  and decommissioning projects on totem-v3

## Documentation
 
The core documentation for this project can be found in the current repository. For open source documentation see [https://github.com/totem/totem-v3](https://github.com/totem/totem-v3)

### Architecture

See [Totem V3 Architecture](https://github.com/totem/totem-v3/tree/develop/architecture)

 
## Setup
 
### Local

- [AWS SAM Local](https://github.com/awslabs/aws-sam-local#windows-linux-osx-with-npm-recommended)
- [node 6.10](https://nodejs.org)
- [gulp-cli](https://www.npmjs.com/package/gulp-cli/tutorial)
 
## Build
 
```
npm install
```
 
## Run
 
### Local

To start API server locally using sam local, run command:

```
sam local start-api 
```
 
## Test

### Travis
The unit and integration tests ar run automatically in [travis](https://travis-ci.org/totem/totem-v3-orchestrator). 


To run unit and integration tests locally, use command:

```
gulp test
```

### Unit Tests
To run just unit tests, use command:

```
gulp test:unit
```

### Integration Tests
To run just integration tests, use command:

```
gulp test:integration
```

### Functional Tests
The functional tests run automatically as part of continuous deployment pipeline for
orchestrator. These tests expect to run in  full functional environment for totem-v3.

To execute functional tests locally, use command:

```
env GITHUB_TOKEN=[GITHUB_TOKEN] \
  TEST_REPO=[TEST_REPO] \
  TEST_OWNER=[TEST_OWNER] \
  TEST_BRANCH=[TEST_BRANCH] \
  AWS_REGION=[AWS_REGION] \
  ORCHESTRATOR_API_ID=[ORCHESTRATOR_API_ID] \
  gulp test:functional
```

- **GITHUB_TOKEN**: Github token used for validating totem v3 setup.
- **TEST_REPO**: Github test repository used to configure with totem-v3 (e.g: totem-demo)
- **TEST_OWNER**: Github test repository owner (e.g.: totem)
- **TEST_BRANCH**: Github test repository branch (e.g.: develop)
- **AWS_REGION**: Aws region where orchestrator is deployed
- **ORCHESTRATOR_API_ID**: API Gateway ID for the orchestrator

 
## Deploy
 
This project is deployed to AWS in a continuous fashion using [codepipeline](https://aws.amazon.com/codepipeline/)

To setup, configure and manage the the pipeline see [provisioning guide](./provisioning)
 
 
## Release
 
This project uses the [Git Flow](https://confluence.meltdev.com/display/DEV/Git+Flow) process for getting changes into the project.


## Resources

- [AWS SAM Model](https://github.com/awslabs/serverless-application-model)
- [Lambda Continuous Deploy](http://docs.aws.amazon.com/lambda/latest/dg/automating-deployment.html) 
- [Codepipeline Cloudformation](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html)
- [Gateway - Step Functions](http://docs.aws.amazon.com/step-functions/latest/dg/tutorial-api-gateway.html)