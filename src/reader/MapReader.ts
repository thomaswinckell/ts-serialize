import {JsValue} from "ts-json-definition";
import Reader from "./Reader";
import FormatterRegistry from "../core/FormatterRegistry";
import SerializeHelper from "../core/SerializeHelper";
import SerializeError from "../model/SerializeError";



const mapReader: Reader<Map<any, any>> = function(json: JsValue, genericTypes: Object[], classPath: string[], failFast: boolean) {

    if(json instanceof Object) {

        const [keyType, ...valueTypes] = genericTypes;

        const readsPromises = Object.keys(json).map((key: any) => {
            const value = json[key];
            const newClassPath = [...classPath, `[${key}]`];

            return SerializeHelper.promiseAll([
                SerializeHelper.defaultReads(value, valueTypes, newClassPath, failFast),
                SerializeHelper.defaultReads(key, [keyType], newClassPath, failFast),
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
        return Promise.reject(SerializeError.readerError([Map, genericTypes], `The value is not a Map.`, classPath))
    }
};


FormatterRegistry.registerDefaultReader(mapReader, Map);

export default mapReader;