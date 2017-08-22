import PropMetadata from "../metadata/PropMetadata";
import PropTypes from "../core/PropTypes";

/**
 * Utils functions to help handle serialize errors
 */
namespace SerializeError {

    export function writerError<T>(className : string, propMetadata: PropMetadata<T>, writerError: any, classPath: string[]) {
        return readerWriterError(className, propMetadata, writerError, classPath, false);
    }

    export function readerError<T>(className : string, propMetadata: PropMetadata<T>, writerError: any, classPath: string[]) {
        return readerWriterError(className, propMetadata, writerError, classPath, true);
    }

    /**
     *  Format a clear error message used when a reader is not found for the given types
     */
    export function undefinedReaderError<T>(className : string, propMetadata: PropMetadata<T>, classPath: string[]) {
        return new Error(`Cannot find reader for property ${className}.${classPath.join('')}${propMetadata.propName} of type '${typesToString(propMetadata.types)}'.`)
    }

    /**
     *  Format a clear error message used when a writer is not found for the given types
     */
    export function undefinedWriterError<T>(className : string, propMetadata: PropMetadata<T>, classPath: string[]) {
        return new Error(`Cannot find writer for property ${className}.${classPath.join('')}${propMetadata.propName} of type '${typesToString(propMetadata.types)}'.`)
    }

    /**
     * Print types
     * Ex : [Map[String, Number]] -> "Map<String, Number>"
     */
    function typesToString(types : PropTypes) : string {
        return types.reduce((acc: any, curr: any) => {
            if(Array.isArray(curr)) {
                return {
                    isPreviousArray: true,
                    value : curr.length > 0 ? `${acc.value}<${typesToString(curr)}>` : acc.value
                };
            } else {
                const typeName = curr.prototype.constructor.name.toString();
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


    /**
     * Format a clear error message for readers/writers errors
     */
    function readerWriterError<T>(className : string, propMetadata: PropMetadata<T>, writerError: any, classPath: string[], isReading: boolean) : Error {

        const writerMessage = writerError instanceof Error ? writerError.message : writerError.toString();

        let toType = 'unknown type';

        if(isReading) {
            if(propMetadata.types[0] && (propMetadata.types[0] as any).prototype) {
                toType = (propMetadata.types[0] as any).prototype.constructor.name;
            }
        } else {
            toType = 'JSON value';
        }

        const errorMessage = `The property ${className}.${classPath.join('')}${propMetadata.propName} cannot be serialized into ${toType}.\nCause: ${writerMessage}`;

        return new Error(errorMessage);
    }
}

export default SerializeError