import {ArgsTypeListDefinition, TypeListDefinition} from "./TypesDefinition";
import SerializeHelper from "./SerializeHelper";

/**
 * Utils functions to help handle serialize errors
 */
namespace SerializeError {

    export function writerError(types: ArgsTypeListDefinition<any>, writerError: any, classPath: string[]) {
        return readerWriterError(types, writerError, classPath, false);
    }

    export function readerError(types: ArgsTypeListDefinition<any>, writerError: any, classPath: string[]) {
        return readerWriterError(types, writerError, classPath, true);
    }

    /**
     *  Format a clear error message used when a reader is not found for the given types
     */
    export function undefinedReaderError(types: TypeListDefinition, classPath: string[]) {
        if(classPath.length === 0) {
            return new Error(`Cannot find reader for type ${typesToString(types)}.`)
        }

        return new Error(`Cannot find reader for ${classPath.join('')} of type ${typesToString(types)}.`)
    }

    /**
     *  Format a clear error message used when a writer is not found for the given types
     */
    export function undefinedWriterError(types: TypeListDefinition, classPath: string[]) {
        if(classPath.length === 0) {
            return new Error(`Cannot find writer for type '${typesToString(types)}'.`)
        }

        return new Error(`Cannot find writer for ${classPath.join('')} of type ${typesToString(types)}.`);
    }

    /**
     * Format a clear error message for readers/writers errors
     */
    function readerWriterError(types : ArgsTypeListDefinition<any>, writerError: any, classPath: string[], isReading: boolean) : Error {

        const writerMessage = writerError instanceof Error ? writerError.message : writerError.toString();

        let toType = 'unknown type';

        if(isReading) {
            toType = typesToString(SerializeHelper.extractPrototypes(types))
        } else {
            toType = 'JSON value';
        }

        const errorMessage = `${classPath.join('')} cannot be serialized into ${toType}.\nCause: ${writerMessage}`;

        return new Error(errorMessage);
    }

    /**
     * Print types
     * Ex : [Map[String, Number]] -> "Map<String, Number>"
     */
    function typesToString(types : TypeListDefinition) : string {
        return types.reduce((acc: any, curr: any) => {
            if(curr instanceof Array) {
                return {
                    shouldPutComma: false,
                    value : curr.length > 0 ? `${acc.value}<${typesToString(curr)}>` : acc.value
                };
            } else if(curr === "|" || curr === "&") {
                return {
                    shouldPutComma: false,
                    value: `${acc.value}${curr}`
                }
            } else {
                const typeName = curr.constructor.name.toString();
                return {
                    shouldPutComma: true,
                    value: `${acc.value}${acc.shouldPutComma ? ', ' : ''}${typeName}`
                }
            }
        }, {
            shouldPutComma : false,
            value: ''
        }).value
    }
}

export default SerializeError