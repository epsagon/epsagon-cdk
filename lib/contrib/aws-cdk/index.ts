import { Construct } from '@aws-cdk/core';
import {
    EpsagonAwsCdkFunctionProps,
    /* to be brought back in */
    // EpsagonAwsCdkSingletonFunctionProps
} from './models';
import { instrumentFunction } from './utils';
import {
    Function as AwsCdkFunction,
    /* to be brought back in */
    // SingletonFunction as AwsCdkSingletonFunction,
    FunctionProps as AwsCdkFunctionProps,
    /* to be brought back in */
    // SingletonFunctionProps as AwsCdkSingletonFunctionProps,
} from '@aws-cdk/aws-lambda'


export class EpsagonFunction extends Construct {

  constructor(scope: Construct, id: string, props: EpsagonAwsCdkFunctionProps) {
    super(scope, id);
    props = instrumentFunction(props);
    console.log("FINAL func props ::")
    console.log((props as AwsCdkFunctionProps).code)
    new AwsCdkFunction(this, id, props as AwsCdkFunctionProps);

  }
}


/* to be brought back in */
// export class EpsagonSingletonFunction extends Construct {
//
//   constructor(scope: Construct, id: string, props: EpsagonSingletonFunctionProps) {
//     super(scope, id);
//
//     // Define construct contents here
//   }
// }
