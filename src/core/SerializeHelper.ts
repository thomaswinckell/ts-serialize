import SerializeError from "../model/SerializeError";
import Serializable from "../model/Serializable";
import {JsValue} from "ts-json-definition";
import ReaderWriterRegistry from "./ReaderWriterRegistry";
import PropTypes from "./PropTypes";
import PropMetadata from "../metadata/PropMetadata";


namespace SerializeHelper {

    export function defaultReads<T>(value: JsValue, types: PropTypes, classPath: string[], failFast: boolean) : Promise<T> {

        const type = types[0];
        const genericTypes = genericTypesFromTypes(types);
        const reader = ReaderWriterRegistry.getDefaultReader(type);

        if(reader) {
            return reader(value, genericTypes, classPath, failFast) as Promise<T>;
        }

        // If the first type is a Serializable child class, we use its static fromJsObject method directly
        if(type && Serializable.prototype.isPrototypeOf((type as any).prototype)) {

            return (type as any).fromJsObject(value, failFast, classPath)
        }

        return Promise.reject(SerializeError.undefinedReaderError(types, classPath))
    }

    export function readsFromMetadata<T>(propMetadata: PropMetadata<T>, value: JsValue, classPath: string[], failFast: boolean) : Promise<T> {
        if(propMetadata.reader) {
            return propMetadata.reader(value, genericTypesFromTypes(propMetadata.types), classPath, failFast)
        } else {
            return defaultReads(value, propMetadata.types, classPath, failFast)
        }
    }

    export function writesFromMetadata<T>(propMetadata: PropMetadata<T>, value: T, classPath: string[], failFast: boolean) : Promise<JsValue> {
        if(propMetadata.writer) {
            return propMetadata.writer(value, genericTypesFromTypes(propMetadata.types), classPath, failFast)
        } else {
            return defaultWrites(value, propMetadata.types, classPath, failFast)
        }
    }

    export function defaultWrites<T>(value: T, types: PropTypes, classPath: string[], failFast: boolean) : Promise<JsValue> {

        const type = types[0];
        const genericTypes = genericTypesFromTypes(types);
        const writer = ReaderWriterRegistry.getDefaultWriter(type);

        if(writer) {
            return writer(value, genericTypes, classPath, failFast);
        }

        // If the first type is a Serializable child class, we use its toJson method directly
        if(value instanceof Serializable) {
            return value.toJson(failFast, classPath)
        }

        return Promise.reject(SerializeError.undefinedWriterError(types, classPath))
    }

    function genericTypesFromTypes(types: PropTypes) : PropTypes {
        if(!types[1]) {
            return [];
        }
        return Array.isArray(types[1]) ? types[1] : [types[1]] as any;
    }

    /**
     * Same as Promise.all but retrieve all errors if failFast activated
     * @see formatErrorMessage
     */
    export function promiseAll<T>(promises : Promise<T>[], failFast : boolean) : Promise<T[]> {

        if(failFast) {
            return Promise.all(promises);

        } else {

            return new Promise<T[]>((resolve, reject) => {

                const caughtPromises = promises.map(p => p.catch(err => {
                    return (Array.isArray(err) ? err : [err]).map(e => e instanceof Error ? e : new Error(e));
                }));

                Promise.all(caughtPromises).then(resOrErrors => {

                    let errors : Error[] = [];
                    let results : T[] = [];

                    resOrErrors.forEach(mbRes => {
                        if(Array.isArray(mbRes) && mbRes[0] instanceof Error) {
                            errors.push(...mbRes);
                        } else {
                            results.push(mbRes as T);
                        }
                    });

                    if(errors.length === 0) {
                        resolve(results);
                    } else {
                        reject(errors);
                    }
                });
            });
        }
    }
}

export default SerializeHelper