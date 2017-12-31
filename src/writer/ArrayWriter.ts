import FormatterRegistry from "../core/FormatterRegistry";
import Writer from "./Writer";
import Serialize from "../core/Serialize";
import {JsValue} from "ts-json-definition";
import {PrototypeListDefinition} from "../core/TypesDefinition";
import SerializeHelper from "../core/SerializeHelper";



const arrayWriter: Writer<any[]> = function(arr: any[], prototype: Object, genericTypes: PrototypeListDefinition, classPath: string[], failFast: boolean) {

    const writesPromises = arr.map((val: any, index: number) => {

        const newClassPath = [...classPath, `[${index}]`];

        return Serialize.writes(val, genericTypes, newClassPath, failFast);
    });

    return SerializeHelper.promiseAll<JsValue>(writesPromises, failFast) as Promise<JsValue>;
};

FormatterRegistry.registerDefaultWriter(arrayWriter, Array);

export default arrayWriter;