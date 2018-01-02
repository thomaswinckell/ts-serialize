import {JsValue} from "ts-json-definition";
import {ArgsTypeListDefinition, ArgTypeDefinition, TypeListDefinition} from "./TypesDefinition";
import FormatterRegistry from "./FormatterRegistry";
import SerializeError from "./SerializeError";
import SerializeHelper from "./SerializeHelper";



namespace Serialize {

    export function reads<T>(value: JsValue, types: ArgsTypeListDefinition<T>, failFast: boolean = true, classPath: string[] = [], typePath: TypeListDefinition = []) : Promise<T> {

        const prototypes = SerializeHelper.extractPrototypes(types);

        if(prototypes[1] === '|') {
            return readsOr(value, prototypes[0], prototypes.slice(2, prototypes.length), failFast, classPath, typePath);
        }

        if(prototypes[1] === '&') {
            return readsAnd(value, prototypes[0], prototypes.slice(2, prototypes.length), failFast, classPath, typePath);
        }

        const type = SerializeHelper.firstTypeFromTypes(prototypes);
        const genericTypes = SerializeHelper.genericTypesFromTypes(prototypes);
        const reader = FormatterRegistry.getDefaultReader(type);

        if(reader) {
            return reader(value, type, genericTypes, classPath, typePath, failFast) as Promise<T>;
        }

        return Promise.reject(SerializeError.undefinedReaderError(prototypes, classPath))
    }

    export function writes(value: any, types: ArgsTypeListDefinition<any>, failFast: boolean = true, classPath: string[] = [], typePath: TypeListDefinition = []) : Promise<JsValue> {

        const prototypes = SerializeHelper.extractPrototypes(types);

        if(prototypes[1] === '|') {
            return writesOr(value, prototypes[0], prototypes.slice(2, prototypes.length), failFast, classPath, typePath);
        }

        if(prototypes[1] === '&') {
            return writesAnd(value, prototypes[0], prototypes.slice(2, prototypes.length), failFast, classPath, typePath);
        }

        const type = SerializeHelper.firstTypeFromTypes(prototypes);
        const genericTypes = SerializeHelper.genericTypesFromTypes(prototypes);
        const writer = FormatterRegistry.getDefaultWriter(type);

        if(writer) {
            return writer(value, type, genericTypes, classPath, typePath, failFast);
        }

        return Promise.reject(SerializeError.undefinedWriterError(prototypes, classPath))
    }

    function readsOr<T>(value: any, type1: ArgTypeDefinition<T>, type2: ArgTypeDefinition<T>, failFast: boolean, classPath: string[], typePath: TypeListDefinition) : Promise<T> {

        return new Promise((resolve, reject) => {
            reads(value, type1, failFast, classPath, typePath)
                .then(resolve)
                .catch(() => {
                    reads(value, type2, failFast, classPath, [...typePath, type1, "|"])
                        .then(resolve)
                        .catch(reject)
                })
        });
    }

    function writesOr(value: any, type1: ArgTypeDefinition<any>, type2: ArgTypeDefinition<any>, failFast: boolean, classPath: string[], typePath: TypeListDefinition) : Promise<JsValue> {

        return new Promise((resolve, reject) => {
            writes(value, type1, failFast, classPath, typePath)
                .then(resolve)
                .catch(() => {
                    writes(value, type2, failFast, classPath, [...typePath, type1, "|"])
                        .then(resolve)
                        .catch(reject)
                })
        });
    }

    function readsAnd<T>(value: any, type1: ArgTypeDefinition<T>, type2: ArgTypeDefinition<T>, failFast: boolean, classPath: string[], typePath: TypeListDefinition) : Promise<T> {

        return new Promise((resolve, reject) => {
            reads(value, type1, failFast, classPath, typePath)
                .then(newValue => {
                    reads(value, type2, failFast, classPath, [...typePath, type1, "&"])
                        .then(newValue2 => {
                            resolve(Object.assign({}, newValue, newValue2));
                        })
                        .catch(reject)
                })
                .catch(reject)
        });
    }

    function writesAnd(value: any, type1: ArgTypeDefinition<any>, type2: ArgTypeDefinition<any>, failFast: boolean, classPath: string[], typePath: TypeListDefinition) : Promise<JsValue> {

        return new Promise((resolve, reject) => {
            reads(value, type1, failFast, classPath, typePath)
                .then(newValue => {
                    reads(value, type2, failFast, classPath, [...typePath, type1, "&"])
                        .then(newValue2 => {
                            resolve(Object.assign({}, newValue, newValue2));
                        })
                        .catch(reject)
                })
                .catch(reject)
        });
    }
}

export default Serialize;