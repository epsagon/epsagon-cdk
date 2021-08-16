

import {
    AnyFunctionProps,
    // AnyEpsagonAwsCdkFunctionProps,
} from './contrib/aws-cdk/models';
import {EpsagonConfig, Mut, ObjectKeys} from './models';
import { RuntimeFamily } from "@aws-cdk/aws-lambda";


export function wrapper(
    funcProps: Mut<AnyFunctionProps>, config: EpsagonConfig, originalCode: string,
) {
    let wrapperCode: string;
    let fileExt: string;
    let bundleOpts: string;

    const {
        relPath, methodName,
    } = deconstructHandler(funcProps.handler)


    switch (funcProps.runtime.family) {
        case RuntimeFamily.PYTHON:
            fileExt = 'py';
            bundleOpts = [
                'pip install epsagon -t /asset-output',
                'cp -rT /asset-input /asset-output',
            ].join(' && ');
            wrapperCode = `\n

${
    originalCode ? 
        originalCode 
    : 'import ' + relPath + ` \n${methodName} = ${relPath}.${methodName}\n`
} 

try:
    import os
    import epsagon
    null = undefined = None
    epsagon.init(
        token='${config.token}',
        app_name='${config.appName}',
        debug=bool('${config.debug}'),
        collector_url='${config.collectorURL}',
        metadata_only=bool('${config.metadataOnly}'),
    )
    ${methodName} = epsagon.${config.wrapper || 'lambda_wrapper'}(${methodName})

except:
    print('Warning: Epsagon package not found. The Function will not be monitored.')
    `;
            break;

        case RuntimeFamily.NODEJS:
            fileExt = 'js';
            bundleOpts = [
                'cd /asset-output',
                'mkdir node_modules',
                'npm i epsagon',
            ].join(' && ');
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
            fileExt = 'txt'
            wrapperCode = '';
            bundleOpts = '';
            break;
    }

    return {
        wrapperCode,
        fileExt,
        bundleOpts,
    };
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