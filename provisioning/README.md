# Provisioning

### Environment stack

#### Create/Update Environment Stack
This step assumes that you have already created [global resources stack](./global-resources-stack).
To spin up new environment stack, execute the following command from [parent folder](..): 


```bash
set -o pipefail
PROFILE=[AWS_CLI_PROFILE]
TOTEM_BUCKET="$(aws --profile=$PROFILE cloudformation describe-stack-resource \
  --logical-resource-id=TotemBucket \
  --stack-name=totem-global \
  --output text | tail -1 | awk '{print $5}')" &&

aws --profile=$PROFILE cloudformation deploy \
  --capabilities=CAPABILITY_NAMED_IAM \
  --template-file=./totem-environment.yml \
  --s3-bucket="$TOTEM_BUCKET" \
  --s3-prefix="cloudformation/totem-orchestrator/" \
  --stack-name=totem-orchestrator-environment \
  --tags \
    "app=totem-v3-orchestrator" \
    "env=development" \
    "client=meltmedia" \
    "stacktype=totem-environment"
```

where:
- **AWS_CLI_PROFILE**: [AWS CLI Profile](http://docs.aws.amazon.com/cli/latest/userguide/cli-multiple-profiles.html)

Note:
- You must modify tags for appropriate totem cluster

## Setup Orchestrator Pipeline

### Create/Update orchestrator pipeline

To create a new orchestrator pipeline execute following command: 

```bash
set -o pipefail
PROFILE=[AWS_CLI_PROFILE]
ENVIRONMENT=[ENVIRONMENT]
GITHUB_OAUTH_TOKEN=[GITHUB_OAUTH_TOKEN]
WEBHOOK_SECRET=[WEBHOOK_SECRET]
TOTEM_BUCKET="$(aws --profile=$PROFILE cloudformation describe-stack-resource \
  --logical-resource-id=TotemBucket \
  --stack-name=totem-global \
  --output text | tail -1 | awk '{print $5}')" &&

aws --profile=$PROFILE cloudformation deploy \
  --template-file=./totem-pipeline.yml \
  --s3-bucket="$TOTEM_BUCKET" \
  --s3-prefix="cloudformation/totem-orchestrator/" \
  --stack-name=totem-orchestrator-pipeline-${ENVIRONMENT} \
  --tags \
    "app=totem-v3-orchestrator" \
    "env=${ENVIRONMENT}" \
    "client=meltmedia" \
    "stacktype=totem-pipeline" \
  --parameter-overrides \
    "GitBranch=feature_pipeline" \
    "GithubOauthToken=${GITHUB_OAUTH_TOKEN}" \
    "WebhookSecret=${WEBHOOK_SECRET}" \
    "TestGitRepo=totem-demo" \
    "TestGitOwner=totem"
```
where:
- **ENVIRONMENT**: Environment for orchestrator (feature, development, production)
- **GITHUB_OAUTH_TOKEN**: Personal oauth token to access github repositories and for configuring webhooks.
- **WEBHOOK_SECRET**: Secret used for configuring totem-v3 github webhooks
- **AWS_CLI_PROFILE**: [AWS CLI Profile](http://docs.aws.amazon.com/cli/latest/userguide/cli-multiple-profiles.html)

## Download Swagger Document

Once API is deployed, you can download swagger document for the deployed API using command:

```bash
set -o pipefail
PROFILE=[AWS_CLI_PROFILE]
ENVIRONMENT=[ENVIRONMENT]
API_ID="$(aws --profile=$PROFILE cloudformation describe-stack-resource \
  --logical-resource-id=ApiGateway \
  --stack-name=totem-orchestrator-development \
  --output text | tail -1 | awk '{print $1}')" &&
aws --profile=$PROFILE apigateway get-export \
  --rest-api-id=$API_ID \
  --stage-name=prod \
  --export-type=swagger \
  --accepts=application/yaml  swagger.yml
```

where:
- **ENVIRONMENT**: Environment for orchestrator (feature, development, production)
- **AWS_CLI_PROFILE**: AWS CLI Profile
