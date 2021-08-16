

import {
    EpsagonConfig, ObjectKeys, Mut, Immut,
} from '../../models';
import { AnyFunctionProps, AnyLambdaFunctionProps } from './models';
import { wrapper, deconstructHandler } from '../../handlers';
import { EPSAGON_HANDLERS_DIR } from '../../const';
import {
    Code,
    InlineCode,
    S3Code,
    AssetCode,
} from '@aws-cdk/aws-lambda';
import * as fs from 'fs';
import {
    join as pathJoin,
    resolve as pathResolve
} from 'path';

const mkdir = (handlerPath: string) => {
    try {
        fs.mkdirSync(handlerPath);
    } catch (err) {
        console.error('Error creating dir')
        console.error(err.message);
    }
}

const pipeToFile = (filePath: string, content: string) => {
    try {
        fs.writeFileSync(filePath, content);
    } catch (err) {
        console.error('Error writing to path');
        console.error(err.message);
    }
}

const resolveHandlersDir = (dirPath: string | undefined) =>
    pathResolve(
        pathJoin(dirPath || '', EPSAGON_HANDLERS_DIR)
    );

const writeHandler = (
    {funcInfo, fileConf}:
        {
            funcInfo: AnyFunctionProps,
            fileConf: {
                fileExt: string,
                wrapperCode: string,
                path?: string,
            }
        }
) => {
    const handlersDir = resolveHandlersDir(fileConf.path);
    mkdir(handlersDir)
    const funcName = funcInfo.functionName || 'main';
    const handlerPath = pathJoin(
        handlersDir,
        funcName,
    )
    pipeToFile(`${handlerPath}.${fileConf.fileExt}`, fileConf.wrapperCode);
    const { methodName:  handlerMethodName} = deconstructHandler(funcInfo.handler);
    return `${fileConf.path ? pathJoin(EPSAGON_HANDLERS_DIR, funcName) : funcName}.${handlerMethodName}`
}


export function createEpsagonConf(props: AnyLambdaFunctionProps): EpsagonConfig {
    let epsagonConf: ObjectKeys = {};
    /*
     * typescript is not mature enough to collect keys of an interface
     * without first instantiating it as a class/object. This feature will one
     * day be added to typescript, at which point, we can remove this hardcoded list.
     *
     * Until that day - this is the ultimate source of truth as to which
     * epsagon configuration keys are collected.
     */
    ([
        'token',
        'appName',
        'metadataOnly',
        'debug',
        'disable',
        'collectorURL',
    ] as const)
        .forEach(p => {
            epsagonConf[p] = props[p];
            delete props[p];
        });

    return epsagonConf as EpsagonConfig;
}

export function instrumentFunction(funcProps: AnyLambdaFunctionProps): AnyFunctionProps {

    const epsagonConf = createEpsagonConf(funcProps);
    const funcPropsMut: Mut<typeof funcProps> = funcProps;
    const { code: codeOriginal } = funcPropsMut

    switch (codeOriginal.constructor.name) {
        case InlineCode.name:
        case AssetCode.name:
            const {
                wrapperCode,
                fileExt,
                bundleOpts,
            } = wrapper(funcPropsMut, epsagonConf, (codeOriginal as any).code);
            const assetPath = (codeOriginal as any).path || EPSAGON_HANDLERS_DIR;
            console.log({assetPath})
            funcPropsMut.handler = writeHandler({
                funcInfo: funcPropsMut as Mut<AnyFunctionProps>,
                fileConf: {fileExt, wrapperCode, path: (codeOriginal as any).path}
            });
            funcPropsMut.code = Code.fromAsset(assetPath, {
                bundling: {
                    command: [
                        'bash', '-c', bundleOpts,
                    ],
                    image: funcPropsMut.runtime.bundlingImage,
                    user: 'root'
                },
            });
            break;
        case S3Code.name:
            /* TODO
             * until added, fall through to default
             * */
        default:
            /*
             * In case of an unsupported Code platform:
             * No instrumentation is added to the function
             * The function will work as-is, untouched by Epsagon.
             */
            break;
    }

    return funcPropsMut as Immut<typeof funcProps>;
}

