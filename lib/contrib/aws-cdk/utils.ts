

import {
    EpsagonConfig, ObjectKeys, Mut, Immut,
} from '../../models';
import { AnyAwsCdkFunctionProps, AnyEpsagonAwsCdkFunctionProps } from './models';
import { wrapper, deconstructHandler } from '../../handlers';
import { EPSAGON_HANDLERS_DIR } from '../../const';
import {
    Code, InlineCode,
    S3Code, AssetCode,
} from '@aws-cdk/aws-lambda';
import { promisify } from 'util';

import * as fs from 'fs';
import { join as pathJoin } from 'path';


const writeFile = promisify(fs.writeFile);
const mv = promisify(fs.rename);
const mkdir = (handlerPath: string) => {
    try {
        fs.mkdirSync(handlerPath);
    } catch (err) {
        // if (err instanceof )
        console.error(err.message)
    }
}

// const rm = (dirPath: string) =>
//     fs.rmdir(dirPath, (err) => {
//         if (err) {
//             console.warn('stam error:')
//             console.warn(err)
//         }
//     });


const writeHandler = (
    {funcInfo, fileConf}:
        {
            funcInfo: AnyAwsCdkFunctionProps,
            fileConf: {
                fileExt: string,
                wrapperCode: string
            }
        }
) => {
    mkdir(EPSAGON_HANDLERS_DIR)
    console.log('functioninfo:: + name::, ', funcInfo)
    const funcName = funcInfo.functionName || 'main';
    const handlerPath = pathJoin(
        EPSAGON_HANDLERS_DIR,
        funcName,
    )
    Promise.resolve(
        writeFile(
            `${handlerPath}.${fileConf.fileExt}`,
            fileConf.wrapperCode,
        )
    )
        .then(r => r)
        .catch(err => console.error(err));
    console.log('wrote to ', pathJoin(
                EPSAGON_HANDLERS_DIR,
                `${funcName}.${fileConf.fileExt}`,
            ))
    console.log('this is what i just wrote:::')
    console.log(fileConf.wrapperCode);
    console.log('the handler:::::::::')
    console.log(funcInfo.handler)

    const { methodName:  handlerMethodName} = deconstructHandler(funcInfo.handler);
    return `${funcName}.${handlerMethodName}`
}

// function cleanUp() {
//     rm(EPSAGON_HANDLERS_DIR);
// }



export function createEpsagonConf(props: AnyEpsagonAwsCdkFunctionProps): EpsagonConfig {
    let epsagonConf: ObjectKeys = {};
    // Object.keys(props as EpsagonConfig).map(e => console.log(e));
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
    const funcPropsMut: Mut<typeof funcProps> = funcProps;
    // const funcPropsMut = (funcProps as AnyEpsagonAwsCdkFunctionProps) as Mut<AnyEpsagonAwsCdkFunctionProps>;

    // const wrapperCode: string = wrapper(funcProps, epsagonConf);
    const { code: codeOriginal } = funcPropsMut

        // .then(r => {
        //     console.log('BEFORE')
        //     console.log('return:', r)
        //     funcPropsMut.handler = r
        //     console.log('AFTER')
        //     console.log('new handler: ', funcPropsMut.handler)
        //
        // })
        // .then(r => r)
        // .catch(err => console.error(err))

    let codeWrapped;
    console.log('got:', codeOriginal)
    console.log('constructor:', codeOriginal.constructor)
    console.log('inline:', InlineCode)

    // if (codeOriginal.constructor == InlineCode) {


    console.log(codeOriginal.constructor.name, InlineCode.name)
    console.log(codeOriginal.constructor.name == InlineCode.name)
    console.log(codeOriginal.constructor.name === InlineCode.name)

    switch (codeOriginal.constructor.name) {
        case InlineCode.name:

            console.log('THIS IS INLINE CODE')
            console.log('==========================================')
            const { wrapperCode, fileExt } = wrapper(funcPropsMut, epsagonConf, (codeOriginal as any).code);

            console.log('original code:::', codeOriginal, typeof codeOriginal)
            console.log(codeOriginal)
            console.log('wrapped code=====', wrapperCode, typeof codeWrapped)
            console.log(codeWrapped)
            console.log('=============')

            // funcPropsMut.code = new InlineCode(codeWrapped);
            // funcPropsMut.code = Code.fromInline(wrapperCode);
            funcPropsMut.handler = writeHandler({funcInfo: funcPropsMut as Mut<AnyAwsCdkFunctionProps>, fileConf: {fileExt, wrapperCode}})
            funcPropsMut.code = Code.fromAsset(EPSAGON_HANDLERS_DIR)
            console.log('mutable code:::')
            console.log(funcPropsMut.code)
            break;
    // }
        case S3Code.name:
        case AssetCode.name:
            console.log('NOT SUPPORTED')
            codeWrapped = 'not empty...';
            break;
        default:
            console.log('DEFAULTED')
            console.log('codeOriginal.constructor', codeOriginal.constructor)
            console.log('codeOriginal.constructor.name', codeOriginal.constructor.name)
            codeWrapped = '';
            break;


    }




    return funcPropsMut as Immut<AnyAwsCdkFunctionProps>;
}

