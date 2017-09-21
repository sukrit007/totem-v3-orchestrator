# totem-v3-orchestrator
Manages the lifecycle for building, deploying  and decommissioning projects on totem-v3

## Documentation
 
The core documentation for this project can be found in the current repository. For open source documentation see [https://github.com/totem/totem-v3](https://github.com/totem/totem-v3)

### Architecture
[TODO: Add link to totem v3 architecture]

### User Guide
[TODO: Add link to totem v3 user guide]

### Operations Guide
[TODO: Add link to totem v3 operations guide]

### Provisioning Guide
[TODO: Add link to totem v3 provisioning guide]

### Developer Guide
[TODO: Add link to totem v3 developer guide]

```bash
set -o pipefail
PROFILE="contrail"
TOTEM_BUCKET="$(aws --profile=$PROFILE cloudformation describe-stack-resource \
  --output json \
  --logical-resource-id=TotemBucket \
  --stack-name=totem-global \
  --output text | tail -1 | awk '{print $1}')" &&

aws --profile=$PROFILE cloudformation package \
  --template-file template.yml \
  --s3-bucket $TOTEM_BUCKET \
  --output-template-file packaged-template.yml \
  --s3-prefix=cloudformation/sam &&
  
OUTPUT_TEMPLATE="$TOTEM_BUCKET/cloudformation/totem-orchestrator.yml" && 
aws --profile=$PROFILE s3 cp ./packaged-template.yml s3://$OUTPUT_TEMPLATE &&

aws --profile=$PROFILE cloudformation create-change-set \
  --change-set-type=CREATE \
  --change-set-name=totem-orchestrator \
  --template-url=https://s3.amazonaws.com/$OUTPUT_TEMPLATE \
  --stack-name=totem-orchestrator \
  --tags \
    "Key=app,Value=totem-v3-orchestrator" \
    "Key=env,Value=development" \
    "Key=client,Value=meltmedia" \
    "Key=stacktype,Value=totem-orchestrator"
```
 
## Setup
 
[What do people need to have installed on their machines to run this project?]
 
## Build
 
[What do people need to do to build this project?]
 
## Run
 
[What do people need to do to run this project?]
 
[How do people verify that the system is running?]
 
## Test
 
[How do people run the tests?]
 
[How do people run automated tests?]
 
## Deploy
 
[What do people need to do to deploy this into Development?]
 
[What do people need to do to deploy this into QA?]
 
[What do people need to do to deploy this into Staging?]
 
[What do people need to do to deploy this into Production?]
 
 
## Release
 
This project uses the [Git Flow](https://confluence.meltdev.com/display/DEV/Git+Flow) process for getting changes into the project.


