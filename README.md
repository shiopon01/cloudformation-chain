# CloudFormation Chain

## How to use

Create yaml template

```yaml
Stacks:

  - StackName: sample-stack
    TemplateURL: https://s3-ap-northeast-1.amazonaws.com/bucket-name/stack-template.yaml
    Capabilities: ['CAPABILITY_IAM', 'CAPABILITY_NAMED_IAM']
    Parameters:
      - ParameterKey: BucketName
        ParameterValue: hello-cfn-chain
```

Run command

```bash
$ node main.js ./chain-sample.yaml
```