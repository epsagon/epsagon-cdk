
<div style="background-color:#Bac7d2;border-radius: 25px">
 <p align="center">
   <a href="https://epsagon.com" target="_blank" align="center">
     <img src="https://cdn2.hubspot.net/hubfs/4636301/Positive%20RGB_Logo%20Horizontal%20-01.svg" width="300">
   </a>
   <br />
 </p>
</div>

# Epsagon Tracing for CDKs

This package provides distributed tracing for Infrastructure as Code applications using [Epsagon](https://app.epsagon.com).


## Contents

- [Installation](#installation)
- [Usage](#usage)
- [Integrations](#cdk-integrations)
- [Configuration](#configuration)


## Installation

Epsagon CDK is available under a variety of languages.

#### TypeScript & JavaScript 

```bash
$ npm i epsagon-cdk
```

#### Python

```bash
$ pip install epsagon-cdk
```


## Usage

Configuration options available at [Configurations](#configuration)

### @aws-cdk

Initialize the Tracer right inside your function declaration.

#### Typescript

Replace `@aws-cdk-lambda.Function` with `epsagon-cdk.LambdaFunction`
 and add your Epsagon configuration directly to your function options.

```typescript
import { LambdaFunction, LambdaSingletonFunction } from 'epsagon-cdk'

new LambdaFunction(this, '<FUNC-ID>', {

    /*  function options  */
    functionName: '<FUNC-NAME>',
    runtime: lambda.Runtime.<RUNTIME>,
    code: lambda.Code.fromAsset(path.join(__dirname, '/PATH/TO/FUNC/DIR')),
    handler: '<HANDLER>',

    /*  epsagon tracing config  */
    token: '<EPSAGON-TOKEN>',
    appName: '<EPSAGON-APP-NAME-STAGE>',
    metadataOnly: <BOOL>,
    debug: <BOOL>,
    disable: <BOOL>,
}); 
```

`LambdaFunction` adds Epsagon as a dependency during bundle-time, increasing package size by no more than 1MB.

lambda.Runtimes supported:
- `Runtime.PYTHON`
- `Runtime.NODEJS`

lambda.Codes supported:
- `Code.InlineCode`
- `Code.AssetCode`

<!---
Currently only `Python` and `Node.js` runtimes are available, 
as well as `Code.fromAsset` & `Code.fromInline`.
Any combination of these Runtimes and Codes will work.
--->

<br>

### Terraform

> Note: No NPM/PIP install is requred.


Replace 
    
    aws_lambda_function 

with epsagon's function module at 

    github.com/epsagon/epsagon-cdk/lib/contrib/terraform

(hint: you can copy and paste)

verify your archive file

```terraform
data "archive_file" "<DEPLOYMENT>" {
  type        = "zip"
  output_path = "${path.module}/PATH/TO/DEPLOYMENT.zip"
  source_dir  = "${path.module}/PATH/TO/DEPLOYMENT_DIR"
}
```

and simply add your Epsagon configuration directly to your function options.

```terraform
module "epsagon_function" {

    /*  EPSAGON MODULE SOURCE  */
    source = "github.com/epsagon/epsagon-cdk/lib/contrib/terraform"
  
    /*  FUNC CONFIG  */
    function_name = "<FUNC-NAME>"
    handler       = "<HANDLER>"
    runtime       = "RUNTIME"
    role          = aws_iam_role.<ROLE>.arn
    timeout       = TIMEOUT

    /*  ARCHIVE CONFIG  */
    /* add the source_dir of the archive */
    source_dir       = data.archive_file.lambda_zip.source_dir
    filename         = data.archive_file.DEPLOYMENT.output_path
    source_code_hash = data.archive_file.DEPLOYMENT.output_base64sha256
  

    /*  EPSAGON CONFIG  */
    token         = "<EPSAGON-TOKEN>"
    app_name      = "<APP-NAME-STAGE>"
    debug         = <BOOL>
    metadata_only = <BOOL>
}
```

## Integrations

The following Cloud Development Kits are supported by Epsagon.

| IaC     | Supported Version |
|---------|-------------------|
| [@aws-cdk](#aws-cdk) | all  |
| [Terraform](#terraform) | all  ||



## Configuration

Advanced options can be configured when declaring Epsagon resources.

| Parameter    | Type    | Default               | Description                                                                         |
|--------------|---------|-----------------------|-------------------------------------------------------------------------------------|
| token        | string  | -                     | The User's Epsagon Account Token                                                    |
| appName      | string  | `Epsagon Application` | Application the function belongs to.                                                |
| metadataOnly | boolean | `true`                | Whether to capture Only Metadata. Set to `false` to capture entire payloads.        |
| debug        | boolean | `false`               | Whether to print debug logs. Set to `true` to output logs, and `false` to not.      |
| disable      | boolean | `false`               | Wether to disable Epsagon tracing. Set to `true` to disable, and `false` to enable. |
| collectorURL | string  | `tc`                  | You should know what you are doing.                               |