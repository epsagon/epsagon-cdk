import { Construct } from '@aws-cdk/core';
import {
    LambdaFunctionProps,
    LambdaSingletonFunctionProps,
} from './models';
import { instrumentFunction } from './utils';
import {
    Function,
    SingletonFunction,
    FunctionProps,
    SingletonFunctionProps,
} from '@aws-cdk/aws-lambda'


export {
    LambdaFunctionProps,
    LambdaSingletonFunctionProps,
}


export class LambdaFunction extends Construct {
  constructor(scope: Construct, id: string, props: LambdaFunctionProps) {
    super(scope, id);
    new Function(
        this, id, instrumentFunction(props) as FunctionProps,
    );
  }
}


export class LambdaSingletonFunction extends Construct {
  constructor(scope: Construct, id: string, props: LambdaSingletonFunctionProps) {
    super(scope, id);
    new SingletonFunction(
        this, id, instrumentFunction(props) as SingletonFunctionProps,
    );
  }
}
