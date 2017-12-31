import {PrototypeListDefinition} from "../core/TypesDefinition";
import Serialize from "../core/Serialize";

/**
 * Utils functions to help handle serialize errors
 */
namespace SerializeError {

    export function writerError(types: PrototypeListDefinition, writerError: any, classPath: string[]) {
        return readerWriterError(types, writerError, classPath, false);
    }

    export function readerError(types: PrototypeListDefinition, writerError: any, classPath: string[]) {
        return readerWriterError(types, writerError, classPath, true);
    }

    /**
     *  Format a clear error message used when a reader is not found for the given types
     */
    export function undefinedReaderError(types: PrototypeListDefinition, classPath: string[]) {
        if(classPath.length === 0) {
            return new Error(`Cannot find reader for type ${typesToString(types)}.`)
        }

        return new Error(`Cannot find reader for ${classPath.join('')} of type ${typesToString(types)}.`)
    }

    /**
     *  Format a clear error message used when a writer is not found for the given types
     */
    export function undefinedWriterError(types: PrototypeListDefinition, classPath: string[]) {
        if(classPath.length === 0) {
            return new Error(`Cannot find writer for type '${typesToString(types)}'.`)
        }

        return new Error(`Cannot find writer for ${classPath.join('')} of type ${typesToString(types)}.`);
    }

    /**
     * Format a clear error message for readers/writers errors
     */
    function readerWriterError(types : PrototypeListDefinition, writerError: any, classPath: string[], isReading: boolean) : Error {

        const writerMessage = writerError instanceof Error ? writerError.message : writerError.toString();

        let toType = 'unknown type';

        if(isReading) {
            toType = typesToString(Serialize.extractPrototypes(types))
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
    function typesToString(types : PrototypeListDefinition) : string {
        return types.reduce((acc: any, curr: any) => {
            if(curr instanceof Array) {
                return {
                    isPreviousArray: true,
                    value : curr.length > 0 ? `${acc.value}<${typesToString(curr)}>` : acc.value
                };
            } else {
                const typeName = curr.constructor.name.toString();
                return {
                    isPreviousArray: false,
                    value: `${acc.value}${acc.isPreviousArray ? '' : ', '}${typeName}`
                }
            }
        }, {
            isPreviousArray : true,
            value: ''
        }).value
    }
}

export default SerializeError