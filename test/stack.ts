
// import { expect as expectCDK, countResources } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as epsagon from '../lib/index';
import {App} from "@aws-cdk/core";


class TestStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    new epsagon.EpsagonFunction(this, 'Producer', {
        token: '38a22955-dee3-4991-8db8-afa09fc9cef6',
        appName: 'cdk-test',
        metadataOnly: false,
        debug: true,
        collectorURL: 'https://dev.tc.epsagon.com',

        runtime: lambda.Runtime.PYTHON_3_7,
        code: lambda.Code.fromInline('def foo(event, context):\n\tprint(\'hello world!\')'),
        handler: 'main.foo',
        // environment: {region: 'us-east-2'}
    })
  }
}

const app = new App();
new TestStack(app, 'AnaTestStack', {
     env: {region: 'us-east-2'}
})
// new epsagon.EpsagonFunction(stack, 'MyTestFunction', {
//     token: '38a22955-dee3-4991-8db8-afa09fc9cef6',
//     appName: 'cdk-test',
//     metadataOnly: false,
//     debug: true,
//     collectorURL: 'https://dev.tc.epsagon.com',
//
//     runtime: lambda.Runtime.PYTHON_3_7,
//     code: lambda.Code.fromInline('print("hello, world!")\n'),
//     handler: 'hand/ler.main',
//     // environment: {region: 'us-east-2'}
//   });
//   const app = new cdk.App();
//   const stack = new cdk.Stack(app, "TestStack", {
//     env: {region: 'us-east-2'}
//   });
//   // WHEN
//   new epsagon.EpsagonFunction(stack, 'MyTestFunction', {
//     token: '38a22955-dee3-4991-8db8-afa09fc9cef6',
//     appName: 'cdk-test',
//     metadataOnly: false,
//     debug: true,
//     collectorURL: 'https://dev.tc.epsagon.com',
//
//     runtime: lambda.Runtime.PYTHON_3_7,
//     code: lambda.Code.fromInline('print("hello, world!")\n'),
//     handler: 'hand/ler.main',
//     // environment: {region: 'us-east-2'}
//   });
// });

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