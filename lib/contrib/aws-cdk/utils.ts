

import {
    EpsagonConfig, ObjectKeys, Mut, Immut,
} from '../models';
import { AnyAwsCdkFunctionProps, AnyEpsagonAwsCdkFunctionProps } from './models';
import { wrapper } from '../handlers';
import { EPSAGON_HANDLERS_DIR } from '../const';
import {
    Code, S3Code, InlineCode, AssetCode,
} from '@aws-cdk/aws-lambda';
import { promisify } from 'util';
import * as fs from 'fs';
import { join as pathJoin } from "path";

function debugLog(...m: string[]) {
    console.log(
        '[EPSAGON]',
        ...m,
    )
}

const mkdir = (handlerPath: string) => {
    try {
        fs.mkdirSync(handlerPath);
    } catch (err) {
        debugLog(err.message)
    }
}
const rm = (dirPath: string) =>
    fs.rmdir(dirPath, (err) => {
        if (err) {
            console.warn('stam error:')
            console.warn(err)
        }
    });

const writeFile = promisify(fs.writeFile);




const generateHandler = async (
    {funcInfo, fileConf}: {funcInfo: AnyAwsCdkFunctionProps, fileConf: { fileExt: string, wrapperCode: string }}
) => {
    mkdir(EPSAGON_HANDLERS_DIR)
    const funcName = funcInfo.functionName || 'main';
    await Promise.resolve(
        writeFile(
            pathJoin(
                EPSAGON_HANDLERS_DIR,
                `${funcName}.${fileConf.fileExt}`,
            ),
            fileConf.wrapperCode,
        )
    );
    console.log('wrote to ', pathJoin(
                EPSAGON_HANDLERS_DIR,
                `${funcName}.${fileConf.fileExt}`,
            ))
    console.log(fileConf.wrapperCode)

}

function cleanUp() {
    rm(EPSAGON_HANDLERS_DIR);
}



export function createEpsagonConf(props: AnyEpsagonAwsCdkFunctionProps): EpsagonConfig {
    let epsagonConf: ObjectKeys = {};
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

    console.log('props')
    console.log(props)

    console.log('props.environment');
    console.log(props.environment, typeof props.environment);

    console.log('props.function-handler');
    console.log(props.handler, typeof props.handler);

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
    // const funcPropsMut = (funcProps as AnyEpsagonAwsCdkFunctionProps) as Mut<AnyEpsagonAwsCdkFunctionProps>;

    // const wrapperCode: string = wrapper(funcProps, epsagonConf);
    const { code: codeOriginal } = funcPropsMut
    const { wrapperCode, fileExt } = wrapper(funcPropsMut, epsagonConf, (codeOriginal as any).code);

    generateHandler({funcInfo: funcProps as AnyAwsCdkFunctionProps, fileConf: {fileExt, wrapperCode}}).then(r => r)
    let codeWrapped;
    console.log(codeOriginal)
    switch (codeOriginal.constructor) {
        case InlineCode:

            console.log('THIS IS INLINE CODE')
            console.log('==========================================')
            console.log('original code:::', codeOriginal, typeof codeOriginal)
            console.log(codeOriginal)
            console.log('wrapped code=====', wrapperCode, typeof codeWrapped)
            console.log(codeWrapped)
            console.log('=============')

            // funcPropsMut.code = new InlineCode(codeWrapped);
            funcPropsMut.code = Code.fromInline(wrapperCode);
            console.log('mutable code:::')
            console.log(funcPropsMut.code)
            break;
        case S3Code:
        case AssetCode:
            console.log('NOT SUPPORTED')
            codeWrapped = 'not empty...';
            break;
        default:
            codeWrapped = '';
            break;


    }




    return { ... <Immut<AnyEpsagonAwsCdkFunctionProps>> funcPropsMut };
}

