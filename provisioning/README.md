# Provisioning

## Setup Orchestrator Pipeline

### Create new orchestrator pipeline

```bash
set -o pipefail
PROFILE=[aws-cli-profile]
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
    "ParameterKey=GithubOauthToken,ParameterValue=[github-oauth-token]" \
  --tags \
    "Key=app,Value=totem-v3-orchestrator" \
    "Key=env,Value=development" \
    "Key=client,Value=meltmedia" \
    "Key=stacktype,Value=totem-orchestrator-pipeline"
```
where:
- **github-oauth-token**: Personal oauth token to access github repositories.
- **aws-cli-profile**: AWS CLI Profile

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