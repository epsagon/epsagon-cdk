
/**
 * EpsagonConfig: interface
 *  - object representing tracer configuration
 */
export interface EpsagonConfig {
    readonly token?: string;
    readonly appName?: string;
    readonly metadataOnly?: boolean;
    readonly debug?: boolean,
    readonly disable?: boolean;
    readonly collectorURL?: string;
    readonly wrapper?: string;
}


/**
 * Mut<T>: mutable
 * turns all fields of T to mutable
 * :param T: type of initial object pre-mutation
 * :return Mut<T>: mutable copy of the same object T
 */
export type Mut<T> = { -readonly [key in keyof T]: T[key] }
/**
 *
 */
export type Immut<T> = { +readonly [key in keyof T]: T[key] }


export interface ObjectKeys {
    [key: string]: string | boolean | object | undefined
}
