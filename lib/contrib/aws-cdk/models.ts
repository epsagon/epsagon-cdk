
import {
    FunctionProps as AwsFunctionProps,
    SingletonFunctionProps as AwsSingletonFunctionProps
} from '@aws-cdk/aws-lambda';

import { EpsagonConfig } from '../../models';

/**
 * interface LambdaFunctionProps
 * extends EpsagonConfig and AwsFunctionProps
 *  - the props passed to Epsagon-traced functions on creation
 */
export interface LambdaFunctionProps extends
    AwsFunctionProps, EpsagonConfig { }

/**
 * interface LambdaSingletonFunctionProps
 * extends EpsagonConfig and AwsSingletonFunctionProps
 *  - the props passed to Epsagon-traced Singleton functions on creation
 */
export interface LambdaSingletonFunctionProps extends
    AwsSingletonFunctionProps, EpsagonConfig { }



/**
 * AnyFunctionProps
 * Represents Any @aws-cdk/aws-lambda Function Props. Both Normal & Singleton.
 */
export type AnyFunctionProps = AwsFunctionProps | AwsSingletonFunctionProps;


/**
 * AnyLambdaFunctionProps
 * Represents any Epsagon-extending interface for @aws-cdk/aws-lambda Function Props. Both Normal & Singleton.
 */
export type AnyLambdaFunctionProps = LambdaFunctionProps | LambdaSingletonFunctionProps;


/*
 *  These runtime-specific function props were purposely removed from the original release
 *  Since typescript does not allow for unused declarations, they were commented out for the time being.
 *  When the time will come to support these experimental functions - they can simply be uncommented.
 */


// import { PythonFunctionProps } from '@aws-cdk/aws-lambda-python';
// import { NodejsFunctionProps } from '@aws-cdk/aws-lambda-nodejs';
/**
 * interface LambdaPythonFunctionProps
 * extends EpsagonConfig and PythonFunctionProps
 *  - the props passed to Epsagon-traced Python functions on creation
 */
// export interface LambdaPythonFunctionProps extends
    // PythonFunctionProps, EpsagonConfig { }

/**
 * interface LambdaNodejsFunctionProps
 * extends EpsagonConfig and NodejsFunctionProps
 *  - the props passed to Epsagon-traced Nodejs functions on creation
 */
// export interface LambdaNodejsFunctionProps extends
//     NodejsFunctionProps, EpsagonConfig { }

// export type AnyLambdaRuntimeFunctionProps = LambdaPythonFunctionProps | LambdaNodejsFunctionProps;
/**
 * AnyRuntimeFunctionProps
 * Represents any runtime-specific @aws-cdk/aws-lambda-LANG Function Props.
 */
// export type AnyRuntimeFunctionProps = PythonFunctionProps | NodejsFunctionProps
