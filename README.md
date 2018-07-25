# CloudFormation Chain

## How to use

First, create yaml template. Stack parameters are the same as `CloudFormation.createStack()` in the SDK.

1. Create yaml template:

```yaml
Stacks:

  - StackName: sample-stack
    TemplateURL: https://s3-ap-northeast-1.amazonaws.com/bucket-name/stack-template.yaml
    Capabilities: ['CAPABILITY_IAM', 'CAPABILITY_NAMED_IAM']
    Parameters:
      - ParameterKey: BucketName
        ParameterValue: hello-cfn-chain
```

Next, execute the command.

2. Execute the command:

```bash
$ node main.js ./chain-sample.yaml
```

## Troubleshooting

- If stack creation fails, created stacks will be deleted. But, if stack deletion fails due by some problem, processing stops.