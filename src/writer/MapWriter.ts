import FormatterRegistry from "../core/FormatterRegistry";
import Writer from "./Writer";
import Serialize from "../core/Serialize";
import {JsValue} from "ts-json-definition";
import {TypeListDefinition} from "../core/TypesDefinition";
import SerializeHelper from "../core/SerializeHelper";



const mapWriter: Writer<Map<any, any>> = function(map: Map<any, any>, prototype: Object, genericTypes: TypeListDefinition, classPath: string[], typePath: TypeListDefinition, failFast: boolean) {

    const [keyType, ...valueTypes] = genericTypes;
    let writesPromises : Promise<JsValue>[] = [];

    map.forEach((value: any, key: any) => {

        const newClassPath = [...classPath, `[${key}]`];

        writesPromises.push(
            SerializeHelper.promiseAll([
                Serialize.writes(value, valueTypes, failFast, newClassPath, typePath),
                Serialize.writes(key, [keyType], failFast, newClassPath, typePath),
            ], failFast) as Promise<JsValue>
        )
    });

    return new Promise((resolve, reject) => {

        SerializeHelper.promiseAll<JsValue>(writesPromises, failFast)
            .then((mapParts : any[]) => {
                const map = mapParts.reduce((acc, [value, key]) => { acc[key] = value; return acc; }, {});
                resolve(map);
            })
            .catch(reject)
    });
};

FormatterRegistry.registerDefaultWriter(mapWriter, Map);

export default mapWriter;