import {JsValue} from "ts-json-definition";
import Reader from "./Reader";
import FormatterRegistry from "../core/FormatterRegistry";
import SerializeError from "../core/SerializeError";
import Serialize from "../core/Serialize";
import {isPlainObject} from "../utils/Validators";
import {TypeListDefinition} from "../core/TypesDefinition";
import SerializeHelper from "../core/SerializeHelper";



const mapReader: Reader<Map<any, any>> = function(json: JsValue, prototype: Object, genericTypes: TypeListDefinition, classPath: string[], typePath: TypeListDefinition, failFast: boolean) {

    if(isPlainObject(json)) {

        const [keyType, ...valueTypes] = genericTypes;

        const readsPromises = Object.keys(json).map((key: any) => {
            const value = json[key];
            const newClassPath = [...classPath, `[${key}]`];

            return SerializeHelper.promiseAll([
                Serialize.reads(value, valueTypes, failFast, newClassPath, []),
                Serialize.reads(key, [keyType], failFast, newClassPath, []),
            ], failFast);
        });

        return new Promise((resolve, reject) => {

            SerializeHelper.promiseAll(readsPromises, failFast)
                .then((mapParts : any[]) => {
                    const map = mapParts.reduce<Map<any, any>>((acc, [value, key]) => {
                        acc.set(key, value);
                        return acc;
                    }, new Map());
                    resolve(map);
                })
                .catch(reject)
        });

    } else {
        return Promise.reject(SerializeError.readerError([...typePath, Map, genericTypes], `The value is not a Map.`, classPath))
    }
};


FormatterRegistry.registerDefaultReader(mapReader, Map);

export default mapReader;