import { expect as expectCDK, countResources } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as epsagon from '../lib/index';


/*
 * Example test
 */
// const test = (x: string, y: () => void) => null
test('Epsagon AwsCdk Function Created', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, "TestStack", {
    env: {region: 'us-east-2'}
  });
  // WHEN
  new epsagon.EpsagonFunction(stack, 'MyTestFunction', {
    token: '38a22955-dee3-4991-8db8-afa09fc9cef6',
    appName: 'cdk-test',
    metadataOnly: false,
    debug: true,
    collectorURL: 'https://dev.tc.epsagon.com',

    runtime: lambda.Runtime.PYTHON_3_7,
    code: lambda.Code.fromInline('print("hello, world!")\n'),
    handler: 'hand/ler.main',
    // environment: {region: 'us-east-2'}
  });
});

// if (require.main === module) {
//     void function () {
//       const app = new cdk.App();
//       const stack = new cdk.Stack(app, "TestStack");
//       // WHEN
//       new epsagon.EpsagonFunction(stack, 'MyTestFunction', {
//         token: '38a22955-dee3-4991-8db8-afa09fc9cef6',
//         appName: 'cdk-test',
//         metadataOnly: false,
//         collectorURL: 'https://dev.tc.epsagon.com',
//
//         runtime: lambda.Runtime.PYTHON_3_7,
//         code: lambda.Code.fromInline('print("hello, world!")\n'),
//         handler: 'hand/ler.main',
//       });
//     }()
// }