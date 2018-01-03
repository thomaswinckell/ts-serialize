import FormatterRegistry from "../core/FormatterRegistry";
import Writer from "./Writer";
import Serialize from "../core/Serialize";
import {JsValue} from "ts-json-definition";
import {TypeListDefinition} from "../core/TypesDefinition";
import SerializeHelper from "../core/SerializeHelper";
import {isMap} from "../utils/Validators";
import SerializeError from "../core/SerializeError";



const mapWriter: Writer = function(map: any, prototype: Object, genericTypes: TypeListDefinition, classPath: string[], typePath: TypeListDefinition, failFast: boolean) {

    if(isMap(map)) {
        const [keyType, ...valueTypes] = genericTypes;
        let writesPromises: Promise<JsValue>[] = [];

        map.forEach((value: any, key: any) => {

            const newClassPath = [...classPath, `[${key}]`];

            writesPromises.push(
                SerializeHelper.promiseAll([
                    Serialize.writes(value, valueTypes, failFast, newClassPath, []),
                    Serialize.writes(key, [keyType], failFast, newClassPath, []),
                ], failFast) as Promise<JsValue>
            )
        });

        return new Promise((resolve, reject) => {

            SerializeHelper.promiseAll<JsValue>(writesPromises, failFast)
                .then((mapParts: any[]) => {
                    const map = mapParts.reduce((acc, [value, key]) => {
                        acc[key] = value;
                        return acc;
                    }, {});
                    resolve(map);
                })
                .catch(reject)
        });
    } else {
        return Promise.reject(SerializeError.writerError([...typePath, Map, genericTypes], `The value is not a Map.`, classPath))
    }
};

FormatterRegistry.registerDefaultWriter(mapWriter, Map);

export default mapWriter;