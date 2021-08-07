
<p align="center">
  <a href="https://epsagon.com" target="_blank" align="center">
    <img src="https://cdn2.hubspot.net/hubfs/4636301/Positive%20RGB_Logo%20Horizontal%20-01.svg" width="300">
  </a>
  <br />
</p>

# Epsagon Tracing for IaC

This package provides distributed tracing for Infrastructure as Code applications using [Epsagon](https://app.epsagon.com).


## Contents

- [Installation](#installation)
- [Usage](#usage)
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

<br />

#### Typescript

Replace `lambda.Function` with `EpsagonFunction`
 and add Epsagon configuration directly to your function options.

```typescript
import { EpsagonFunction, EpsagonSingletonFunction } from 'epsagon-cdk'

/*  ...  */
new EpsagonFunction(this, '<FUNC-ID>', {

    /*  function options  */
    functionName: '<FUNC-NAME>',
    runtime: lambda.Runtime.<RUNTIME>,
    code: lambda.Code.fromInline('def fooNorm(*_):\n    print(333)'),
    handler: '<HANDLER>',

    /*  epsagon tracing config  */
    token: '<EPSAGON-TOKEN>',
    appName: '<EPSAGON-APP-NAME>',
    metadataOnly: false,
    debug: true,
    disable: false,

});

```


## Configuration