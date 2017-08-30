import FormatterRegistry from "../core/FormatterRegistry";
import Writer from "./Writer";
import SerializeHelper from "../core/SerializeHelper";
import {JsValue} from "ts-json-definition";



const arrayWriter: Writer<any[]> = function(arr: any[], genericTypes: Object[], classPath: string[], failFast: boolean) {

    const writesPromises = arr.map((val: any, index: number) => {

        const newClassPath = [...classPath, `[${index}]`];

        return SerializeHelper.defaultWrites(val, genericTypes, newClassPath, failFast);
    });

    return SerializeHelper.promiseAll<JsValue>(writesPromises, failFast) as Promise<JsValue>;
};

FormatterRegistry.registerDefaultWriter(arrayWriter, Array);

export default arrayWriter;