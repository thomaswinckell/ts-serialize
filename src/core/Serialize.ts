import {JsValue} from "ts-json-definition";
import {TypeDefinition, PrototypeListDefinition, TypeListDefinition} from "./TypesDefinition";
import FormatterRegistry from "./FormatterRegistry";
import SerializeError from "../model/SerializeError";
import PropMetadata from "../metadata/PropMetadata";



namespace Serialize {

    export function reads<T>(value: JsValue, types: TypeListDefinition|PrototypeListDefinition|TypeDefinition<T>|Object, classPath: string[] = [], failFast: boolean = true) : Promise<T> {

        const prototypes = extractPrototypes(types);
        const type = firstTypeFromTypes(prototypes);
        const genericTypes = genericTypesFromTypes(prototypes);
        const reader = FormatterRegistry.getDefaultReader(type);

        if(reader) {
            return reader(value, type, genericTypes, classPath, failFast) as Promise<T>;
        }

        return Promise.reject(SerializeError.undefinedReaderError(prototypes, classPath))
    }

    export function writes(value: any, types: TypeListDefinition|PrototypeListDefinition|TypeDefinition<any>|Object, classPath: string[] = [], failFast: boolean = true) : Promise<JsValue> {

        const prototypes = extractPrototypes(types);
        const type = firstTypeFromTypes(prototypes);
        const genericTypes = genericTypesFromTypes(prototypes);
        const writer = FormatterRegistry.getDefaultWriter(type);

        if(writer) {
            return writer(value, type, genericTypes, classPath, failFast);
        }

        return Promise.reject(SerializeError.undefinedWriterError(prototypes, classPath))
    }

    // TODO move all of this below

    export function readsFromMetadata<T>(propMetadata: PropMetadata<T>, value: JsValue, classPath: string[], failFast: boolean) : Promise<T> {

        console.log('readsFromMetadata');
        console.log(propMetadata.types);

        console.log('propMetadata.reader');
        console.log(propMetadata.reader);

        if(propMetadata.reader) {
            return propMetadata.reader(value, firstTypeFromTypes(propMetadata.types), genericTypesFromTypes(propMetadata.types), classPath, failFast)
        } else {
            return reads(value, propMetadata.types, classPath, failFast)
        }
    }

    export function writesFromMetadata<T>(propMetadata: PropMetadata<T>, value: T, classPath: string[], failFast: boolean) : Promise<JsValue> {
        if(propMetadata.writer) {
            return propMetadata.writer(value, firstTypeFromTypes(propMetadata.types), genericTypesFromTypes(propMetadata.types), classPath, failFast)
        } else {
            return writes(value, propMetadata.types, classPath, failFast)
        }
    }

    export function extractPrototypes(mbTypes: TypeListDefinition|PrototypeListDefinition|TypeDefinition<any>|Object) : PrototypeListDefinition {

        if(!(mbTypes instanceof Array)) {
            return [(mbTypes as any).prototype || mbTypes];
        }

        return (mbTypes as any).map((t: any) => {
            if(t instanceof Array) {
                return extractPrototypes(t);
            }
            return t.prototype || t;
        });
    }

    function firstTypeFromTypes(types: PrototypeListDefinition) : Object {
        return types[0] instanceof Array ? firstTypeFromTypes(types[0] as PrototypeListDefinition) : types[0] as Object;
    }

    function genericTypesFromTypes(types: PrototypeListDefinition) : PrototypeListDefinition {
        if(!types[1]) {
            return [];
        }
        return types[1] instanceof Array ? types[1] : [types[1]] as any;
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
                    return (err instanceof Array ? err : [err]).map((e: any) => e instanceof Error ? e : new Error(e));
                }));

                Promise.all(caughtPromises).then(resOrErrors => {

                    let errors : Error[] = [];
                    let results : T[] = [];

                    resOrErrors.forEach(mbRes => {
                        if(mbRes instanceof Array && mbRes[0] instanceof Error) {
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

export default Serialize;