import {JsValue} from "ts-json-definition";
import Reader from "./Reader";
import FormatterRegistry from "../core/FormatterRegistry";
import SerializeError from "../core/SerializeError";
import Serialize from "../core/Serialize";
import {isObject} from "../utils/Utils";
import {PrototypeListDefinition} from "../core/TypesDefinition";
import SerializeHelper from "../core/SerializeHelper";


const objectReader: Reader<Object> = function(json: JsValue, prototype: Object, genericTypes: PrototypeListDefinition, classPath: string[], failFast: boolean) {

    if(isObject(json)) {

        const [keyType, ...valueTypes] = genericTypes;

        const readsPromises = Object.keys(json).map((key: any) => {
            const value = json[key];
            const newClassPath = classPath.length === 0 ?
                ['Object', `[${key}]`] :
                [...classPath, `[${key}]`];

            return SerializeHelper.promiseAll([
                Serialize.reads(value, valueTypes, newClassPath, failFast),
                Serialize.reads(key, [keyType], newClassPath, failFast),
            ], failFast);
        });

        return new Promise((resolve, reject) => {

            SerializeHelper.promiseAll(readsPromises, failFast)
                .then((mapParts : any[]) => {
                    const map = mapParts.reduce<{}>((acc, [value, key]) => ({
                        ...acc,
                        [key]: value
                    }), {});
                    resolve(map);
                })
                .catch(reject)
        });
    } else {
        return Promise.reject(SerializeError.readerError([Array, genericTypes], `The value is not an object.`, classPath))
    }
};


FormatterRegistry.registerDefaultReader(objectReader, Object);

export default objectReader;