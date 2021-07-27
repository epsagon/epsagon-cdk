
// import {EpsagonFunction, EpsagonSingletonFunction} from "./index";
// import { EpsagonConfig } from './config';

import {EpsagonAwsCdkFunctionProps}
    from "./aws-cdk/models";

export interface EpsagonConfig {
    readonly token?: string;
    readonly appName?: string;
    readonly metadataOnly?: boolean;
    readonly debug?: boolean,
    readonly disable?: boolean;
    readonly collectorURL?: string;
    readonly wrapper?: string;
}


export type Mut<T> = { -readonly [key in keyof T]: T[key] }
export type Immut<T> = { +readonly [key in keyof T]: T[key] }


export interface ObjectKeys {
    [key: string]: string | boolean | object | undefined
}