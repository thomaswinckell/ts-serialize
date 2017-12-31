import FormatterRegistry from "../core/FormatterRegistry";
import Writer from "./Writer";
import Serialize from "../core/Serialize";
import {JsValue} from "ts-json-definition";
import {PrototypeListDefinition} from "../core/TypesDefinition";



const mapWriter: Writer<Map<any, any>> = function(map: Map<any, any>, prototype: Object, genericTypes: PrototypeListDefinition, classPath: string[], failFast: boolean) {

    const [keyType, ...valueTypes] = genericTypes;
    let writesPromises : Promise<JsValue>[] = [];

    map.forEach((value: any, key: any) => {

        const newClassPath = [...classPath, `[${key}]`];

        writesPromises.push(
            Serialize.promiseAll([
                Serialize.writes(value, valueTypes, newClassPath, failFast),
                Serialize.writes(key, [keyType], newClassPath, failFast),
            ], failFast) as Promise<JsValue>
        )
    });

    return new Promise((resolve, reject) => {

        Serialize.promiseAll<JsValue>(writesPromises, failFast)
            .then((mapParts : any[]) => {
                const map = mapParts.reduce((acc, [value, key]) => { acc[key] = value; return acc; }, {});
                resolve(map);
            })
            .catch(reject)
    });
};

FormatterRegistry.registerDefaultWriter(mapWriter, Map);

export default mapWriter;