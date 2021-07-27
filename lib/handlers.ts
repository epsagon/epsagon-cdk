

import {
    AnyAwsCdkFunctionProps,
    AnyEpsagonAwsCdkFunctionProps,
} from './aws-cdk/models';
import { EpsagonConfig } from './models';
import { RuntimeFamily, Code } from "@aws-cdk/aws-lambda";


export function wrapper(funcProps: AnyAwsCdkFunctionProps, config: EpsagonConfig) {
    let wrapperCode: string;

    const handler = funcProps.handler.split('.');
    const relPath = handler.slice(0, -1).join('.');
    const [ methodName ] = handler.slice(-1);
    // console.log('og handler-', funcProps.handler)
    // console.log('relPath-', relPath)
    // console.log('methodName-', methodName)

    switch (funcProps.runtime.family) {
        case RuntimeFamily.PYTHON:
            wrapperCode = `\n
from ${relPath} import ${methodName} as ${methodName}_internal
try:
    import os
    import epsagon
    null = undefined = None
    epsagon.init(
        token='${config.token}',
        app_name='${config.appName}',
        collector_url='${config.collectorURL}',
        metadata_only=bool('${config.metadataOnly}'),
    )
    
    ${methodName} = epsagon.${config.wrapper || 'lambda_wrapper'}(${methodName}_internal)
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


