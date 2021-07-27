
import {
    FunctionProps as AwsFunctionProps,
    SingletonFunctionProps as AwsSingletonFunctionProps
} from '@aws-cdk/aws-lambda';
import { EpsagonConfig } from '../models';

export interface EpsagonAwsCdkFunctionProps extends EpsagonConfig, AwsFunctionProps { }
export interface EpsagonAwsCdkSingletonFunctionProps extends EpsagonConfig, AwsSingletonFunctionProps { }

export type AnyAwsCdkFunctionProps = AwsFunctionProps | AwsSingletonFunctionProps;
export type AnyEpsagonAwsCdkFunctionProps = EpsagonAwsCdkFunctionProps | EpsagonAwsCdkSingletonFunctionProps;
