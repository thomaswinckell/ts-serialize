import PropTypes from "../core/PropTypes";

/**
 * Utils functions to help handle serialize errors
 */
namespace SerializeError {

    export function writerError<T>(types: PropTypes, writerError: any, classPath: string[]) {
        return readerWriterError(types, writerError, classPath, false);
    }

    export function readerError<T>(types: PropTypes, writerError: any, classPath: string[]) {
        return readerWriterError(types, writerError, classPath, true);
    }

    /**
     *  Format a clear error message used when a reader is not found for the given types
     */
    export function undefinedReaderError<T>(types: PropTypes, classPath: string[]) {
        return new Error(`Cannot find reader for property ${classPath.join('')} of type '${typesToString(types)}'.`)
    }

    /**
     *  Format a clear error message used when a writer is not found for the given types
     */
    export function undefinedWriterError<T>(types: PropTypes, classPath: string[]) {
        return new Error(`Cannot find writer for property ${classPath.join('')} of type '${typesToString(types)}'.`)
    }

    /**
     * Format a clear error message for readers/writers errors
     */
    function readerWriterError<T>(types : PropTypes, writerError: any, classPath: string[], isReading: boolean) : Error {

        const writerMessage = writerError instanceof Error ? writerError.message : writerError.toString();

        let toType = 'unknown type';

        if(isReading) {
            toType = typesToString(types)
        } else {
            toType = 'JSON value';
        }

        const errorMessage = `The property ${classPath.join('')} cannot be serialized into ${toType}.\nCause: ${writerMessage}`;

        return new Error(errorMessage);
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
}

export default SerializeError