

import {
    AnyAwsCdkFunctionProps,
    AnyEpsagonAwsCdkFunctionProps,
} from './aws-cdk/models';
import {EpsagonConfig, Mut, ObjectKeys} from './models';
import { RuntimeFamily, Code } from "@aws-cdk/aws-lambda";


export function wrapper(
    funcProps: Mut<AnyAwsCdkFunctionProps>, config: EpsagonConfig, originalCode: string,
): string {
    let wrapperCode: string;

    // const handler = funcProps.handler.split('.');
    // const relPath = handler.slice(0, -1).join('.');
    // const [ methodName ] = handler.slice(-1);
    // console.log(deconstructHandler(funcProps.handler))
    const {
        relPath, methodName,
    } = deconstructHandler(funcProps.handler)


    //from ${(<string> relPath)
    //     .split('/')
    //      .join('.')} import ${methodName} as ${methodName}_internal
    //    ${methodName} = epsagon.${config.wrapper || 'lambda_wrapper'}(${methodName}_internal)

    switch (funcProps.runtime.family) {
        case RuntimeFamily.PYTHON:
            // funcProps.handler =

            //
            wrapperCode = `\n

try:
    import os
    import epsagon
    null = undefined = None
    epsagon.init(
        token='${config.token}',
        app_name='${config.appName}',
        debug=bool('${config.debug}')
        collector_url='${config.collectorURL}',
        metadata_only=bool('${config.metadataOnly}'),
    )
    ${methodName} = epsagon.${config.wrapper || 'lambda_wrapper'}(lambda (event, context): ${originalCode})
except:
    print('Warning: Epsagon package not found. The Function will not be monitored.')
    `;
            break;

        case RuntimeFamily.NODEJS:

            wrapperCode = `\n
const epsagon = require('epsagon');
const epsagonHandler = require('../${relPath}');

epsagon.init({
    token: '${config.token}',
    appName: '${config.appName}',
    traceCollectorURL: '${config.collectorURL}',
    metadataOnly: Boolean('${config.metadataOnly}'),
});

exports.${methodName} = epsagon.${config.wrapper}(epsagonHandler.${methodName});
`;
            break;

        default:
            wrapperCode = '';
            break;
    }

    console.log('wrapperCode::');
    console.log(`language - ${funcProps.runtime.family}`);
    console.log(wrapperCode);
    return wrapperCode;
}

export function deconstructHandler(handler: string): ObjectKeys {
    const handlerSplit = handler.split('.');
    const relPath = handlerSplit.slice(0, -1).join('.');
    const [ methodName ] = handlerSplit.slice(-1);
    return {
        relPath,
        methodName,
    }
}