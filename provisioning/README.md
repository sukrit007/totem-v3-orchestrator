# Provisioning

### Environment stack

#### New Environment Stack
This step assumes that you have already created [global resources stack](./global-resources-stack).
To spin up new environment stack, execute the following command from [parent folder](..): 


```bash
set -o pipefail
PROFILE=[AWS_CLI_PROFILE]
TOTEM_BUCKET="$(aws --profile=$PROFILE cloudformation describe-stack-resource \
  --logical-resource-id=TotemBucket \
  --stack-name=totem-global \
  --output text | tail -1 | awk '{print $1}')" &&

OUTPUT_TEMPLATE="$TOTEM_BUCKET/cloudformation/totem-environment.yml" && 

aws --profile=$PROFILE s3 cp ./modules/totem-v3/provisioning/totem-environment.yml s3://$OUTPUT_TEMPLATE &&

aws --profile=$PROFILE cloudformation create-stack \
  --template-url=https://s3.amazonaws.com/$OUTPUT_TEMPLATE \
  --stack-name=totem-environment \
  --capabilities=CAPABILITY_NAMED_IAM \
  --tags \
    "Key=app,Value=totem-v3" \
    "Key=env,Value=development" \
    "Key=client,Value=totem" \
    "Key=stacktype,Value=totem-environment"
```

where:
- **AWS_CLI_PROFILE**: [AWS CLI Profile](http://docs.aws.amazon.com/cli/latest/userguide/cli-multiple-profiles.html)


To monitor the status of the stack creation, use command:

```bash
aws --profile=contrail cloudformation describe-stacks \
  --stack-name=totem-environment  
```

Note:
- You must modify tags for appropriate totem cluster

## Setup Orchestrator Pipeline

### Create new orchestrator pipeline

To create a new orchestrator pipeline execute following command: 

```bash
set -o pipefail
PROFILE=[AWS_CLI_PROFILE]
GITHUB_OAUTH_TOKEN=[GITHUB_OAUTH_TOKEN]
WEBHOOK_SECRET=[WEBHOOK_SECRET]
TOTEM_BUCKET="$(aws --profile=$PROFILE cloudformation describe-stack-resource \
  --logical-resource-id=TotemBucket \
  --stack-name=totem-global \
  --output text | tail -1 | awk '{print $1}')" &&

OUTPUT_TEMPLATE="$TOTEM_BUCKET/cloudformation/totem-orchestrator-pipeline-development.yml" && 

aws --profile=$PROFILE s3 cp ./modules/totem-v3-orchestrator/provisioning/orchestrator-pipeline.yml s3://$OUTPUT_TEMPLATE &&

aws --profile=$PROFILE cloudformation create-stack \
  --template-url=https://s3.amazonaws.com/$OUTPUT_TEMPLATE \
  --stack-name=totem-orchestrator-pipeline-development \
  --parameters \
    "ParameterKey=GithubOauthToken,ParameterValue=${GITHUB_OAUTH_TOKEN}" \
    "ParameterKey=WebhookSecret,ParameterValue=${WEBHOOK_SECRET}" \
  --tags \
    "Key=app,Value=totem-v3-orchestrator" \
    "Key=env,Value=development" \
    "Key=client,Value=meltmedia" \
    "Key=stacktype,Value=totem-orchestrator-pipeline"
```
where:
- **GITHUB_OAUTH_TOKEN**: Personal oauth token to access github repositories and for configuring webhooks.
- **WEBHOOK_SECRET**: Secret used for configuring totem-v3 github webhooks
- **AWS_CLI_PROFILE**: [AWS CLI Profile](http://docs.aws.amazon.com/cli/latest/userguide/cli-multiple-profiles.html)

To monitor the status of the stack creation, use command:

```bash
aws --profile=[aws-cli-profile] cloudformation describe-stacks \
  --stack-name=totem-orchestrator-pipeline-development
```

### Update existing orchestrator pipeline

```bash
aws --profile=[aws-cli-profile] cloudformation deploy \
  --template-file=./provisioning/orchestrator-pipeline.yml \
  --stack-name=totem-orchestrator-pipeline-development \
  --parameter-overrides \
    "GitBranch=develop"
```

where:
- **aws-cli-profile**: AWS CLI Profile


## Download Swagger Document

Once API is deployed, you can download swagger document for the deployed API using command:

```bash
set -o pipefail
PROFILE=[aws-cli-profile]
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
- **aws-cli-profile**: AWS CLI Profile