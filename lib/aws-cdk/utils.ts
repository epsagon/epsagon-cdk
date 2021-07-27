

import {
    EpsagonConfig,
    ObjectKeys,
    Mut,
    Immut,
} from '../models';
import { AnyAwsCdkFunctionProps, AnyEpsagonAwsCdkFunctionProps } from './models';
import { wrapper } from '../handlers';
import { RuntimeFamily, Code } from "@aws-cdk/aws-lambda";
import {
    S3Code, InlineCode, EcrImageCode, AssetCode,
} from '@aws-cdk/aws-lambda'

export function createEpsagonConf(props: AnyEpsagonAwsCdkFunctionProps): EpsagonConfig {
    let epsagonConf: ObjectKeys = {};
    (['token', 'appName', 'metadataOnly', 'disable', 'collectorURL'] as const)
        .forEach(p => {
            epsagonConf[p] = props[p];
            delete props[p];
        });

    console.log('props')
    console.log(props)

    console.log('props.environment');
    console.log(props.environment);

    console.log('props.function-handler');
    console.log(props.handler);

    console.log('handmade epsagonConf:')
    console.log(epsagonConf)



    return epsagonConf as EpsagonConfig;
}

export function instrumentFunction(funcProps: AnyEpsagonAwsCdkFunctionProps): AnyAwsCdkFunctionProps {

    // const mutProps: Mut = props;

    // const { handler } = funcProps;
    // console.log(handler)
    const epsagonConf = createEpsagonConf(funcProps);
    const funcPropsMut: Mut<AnyEpsagonAwsCdkFunctionProps> = funcProps;

    // const

    // const wrapperCode: string = wrapper(funcProps, epsagonConf);
    const { code: codeOriginal } = funcPropsMut
    let codeWrapped;
    console.log(codeOriginal)
    switch (codeOriginal.constructor) {
        case InlineCode:
            codeWrapped = wrapper(funcPropsMut, epsagonConf);
            funcPropsMut.code = new InlineCode(codeWrapped);
            break;
        case S3Code:
        case AssetCode:
            console.log('NOT SUPPORTED')
            break;
        default:
            break;
    }



    return { ... <Immut<AnyEpsagonAwsCdkFunctionProps>> funcPropsMut };
}