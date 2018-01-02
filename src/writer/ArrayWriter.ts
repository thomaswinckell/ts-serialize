import FormatterRegistry from "../core/FormatterRegistry";
import Writer from "./Writer";
import Serialize from "../core/Serialize";
import {JsValue} from "ts-json-definition";
import {TypeListDefinition} from "../core/TypesDefinition";
import SerializeHelper from "../core/SerializeHelper";



const arrayWriter: Writer<any[]> = function(arr: any[], prototype: Object, genericTypes: TypeListDefinition, classPath: string[], typePath: TypeListDefinition, failFast: boolean) {

    const writesPromises = arr.map((val: any, index: number) => {

        const newClassPath = [...classPath, `[${index}]`];

        return Serialize.writes(val, genericTypes, failFast, newClassPath, typePath);
    });

    return SerializeHelper.promiseAll<JsValue>(writesPromises, failFast) as Promise<JsValue>;
};

FormatterRegistry.registerDefaultWriter(arrayWriter, Array);

export default arrayWriter;