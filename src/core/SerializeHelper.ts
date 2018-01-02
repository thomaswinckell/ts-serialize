import {JsValue} from "ts-json-definition";
import {TypeListDefinition, ArgsTypeListDefinition, TypeOperator} from "./TypesDefinition";
import {PropMetadata} from "../metadata/ObjectMetadata";
import Serialize from "./Serialize";



namespace SerializeHelper {

    export function readsFromMetadata<T>(propMetadata: PropMetadata<T>, value: JsValue, failFast: boolean, classPath: string[], typePath: TypeListDefinition) : Promise<T> {

        if(propMetadata.reader) {
            return propMetadata.reader(value, firstTypeFromTypes(propMetadata.types), genericTypesFromTypes(propMetadata.types), classPath, typePath, failFast)
        } else {
            return Serialize.reads(value, propMetadata.types, failFast, classPath, typePath)
        }
    }

    export function writesFromMetadata<T>(propMetadata: PropMetadata<T>, value: T, failFast: boolean, classPath: string[], typePath: TypeListDefinition) : Promise<JsValue> {
        if(propMetadata.writer) {
            return propMetadata.writer(value, firstTypeFromTypes(propMetadata.types), genericTypesFromTypes(propMetadata.types), classPath, typePath, failFast)
        } else {
            return Serialize.writes(value, propMetadata.types, failFast, classPath, typePath)
        }
    }

    export function extractPrototypes(mbTypes: ArgsTypeListDefinition<any>) : TypeListDefinition {

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

    export function firstTypeFromTypes(types: TypeListDefinition) : Object|TypeOperator {
        return types[0] instanceof Array ? firstTypeFromTypes(types[0] as TypeListDefinition) : types[0] as Object|TypeOperator;
    }

    export function genericTypesFromTypes(types: TypeListDefinition) : TypeListDefinition {
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

export default SerializeHelper;