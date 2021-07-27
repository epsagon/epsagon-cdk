import { Construct, Stack } from '@aws-cdk/core';
import {
    EpsagonAwsCdkFunctionProps, EpsagonAwsCdkSingletonFunctionProps
} from "./models";
import { instrumentFunction } from "./utils";
import {
    Function as AwsCdkFunction,
    SingletonFunction as AwsCdkSingletonFunction,
    FunctionProps as AwsCdkFunctionProps,
    SingletonFunctionProps as AwsCdkSingletonFunctionProps,
} from '@aws-cdk/aws-lambda'

// export interface EpsagonCdkProps {
//   // Define construct properties here
// }

export class EpsagonFunction extends Construct {

  constructor(scope: Construct, id: string, props: EpsagonAwsCdkFunctionProps) {
    super(scope, id);
    props = instrumentFunction(props);
    console.log("FINAL func props ::")
    console.log( <AwsCdkFunctionProps> props)
    new AwsCdkFunction(this, id, <AwsCdkFunctionProps> props);

  }
}

// export class EpsagonStack extends Stack {
//     constructor(scope: Construct, id: string, props: EpsagonAwsCdkSingletonFunctionProps) {
//         super(props);
//
//     }
//
// }

// export class EpsagonSingletonFunction extends Construct {
//
//   constructor(scope: Construct, id: string, props: EpsagonSingletonFunctionProps) {
//     super(scope, id);
//
//     // Define construct contents here
//   }
// }
