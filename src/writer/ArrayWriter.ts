import FormatterRegistry from "../core/FormatterRegistry";
import Writer from "./Writer";
import Serialize from "../core/Serialize";
import {JsValue} from "ts-json-definition";
import {TypeListDefinition} from "../core/TypesDefinition";
import SerializeHelper from "../core/SerializeHelper";
import {isArray} from "../utils/Validators";
import SerializeError from "../core/SerializeError";



const arrayWriter: Writer = function(arr: any, prototype: Object, genericTypes: TypeListDefinition, classPath: string[], typePath: TypeListDefinition, failFast: boolean) {

    if(isArray(arr)) {

        const writesPromises = arr.map((val: any, index: number) => {

            const newClassPath = [...classPath, `[${index}]`];

            return Serialize.writes(val, genericTypes, failFast, newClassPath, []);
        });

        return SerializeHelper.promiseAll<JsValue>(writesPromises, failFast) as Promise<JsValue>;

    } else {
        return Promise.reject(SerializeError.writerError([...typePath, Array, genericTypes], `The value is not an array.`, classPath))
    }
};

FormatterRegistry.registerDefaultWriter(arrayWriter, Array);

export default arrayWriter;