import FormatterRegistry from "../core/FormatterRegistry";
import Writer from "./Writer";
import SerializeHelper from "../core/SerializeHelper";
import {JsValue} from "ts-json-definition";



const mapWriter: Writer<Map<any, any>> = function(map: Map<any, any>, genericTypes: Object[], classPath: string[], failFast: boolean) {

    const [keyType, ...valueTypes] = genericTypes;
    let writesPromises : Promise<JsValue>[] = [];

    map.forEach((value: any, key: any) => {

        const newClassPath = [...classPath, `[${key}]`];

        writesPromises.push(
            SerializeHelper.promiseAll([
                SerializeHelper.defaultWrites(value, valueTypes, newClassPath, failFast),
                SerializeHelper.defaultWrites(key, [keyType], newClassPath, failFast),
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