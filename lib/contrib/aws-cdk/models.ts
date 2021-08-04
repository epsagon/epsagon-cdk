
import {
    FunctionProps as AwsFunctionProps,
    SingletonFunctionProps as AwsSingletonFunctionProps
} from '@aws-cdk/aws-lambda';
import { EpsagonConfig } from '../models';

/**
 * interface EpsagonAwsCdkFunctionProps
 * extends EpsagonConfig and AwsFunctionProps
 *  - the props passed to Epsagon-traced functions on creation
 */
export interface EpsagonAwsCdkFunctionProps extends EpsagonConfig, AwsFunctionProps { }

/**
 * interface EpsagonAwsCdkSingletonFunctionProps
 * extends EpsagonConfig and AwsSingletonFunctionProps
 *  - the props passed to Epsagon-traced singleton functions on creation
 */
export interface EpsagonAwsCdkSingletonFunctionProps extends EpsagonConfig, AwsSingletonFunctionProps { }


export type AnyAwsCdkFunctionProps = AwsFunctionProps | AwsSingletonFunctionProps;
export type AnyEpsagonAwsCdkFunctionProps = EpsagonAwsCdkFunctionProps | EpsagonAwsCdkSingletonFunctionProps;
