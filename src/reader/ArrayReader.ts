import {Json, JsValue} from "ts-json-definition";
import Reader from "./Reader";
import FormatterRegistry from "../core/FormatterRegistry";
import Serialize from "../core/Serialize";
import SerializeError from "../core/SerializeError";
import {TypeListDefinition} from "../core/TypesDefinition";
import SerializeHelper from "../core/SerializeHelper";



const arrayReader: Reader<any[]> = function(json: JsValue, prototype: Object, genericTypes: TypeListDefinition, classPath: string[], typePath: TypeListDefinition, failFast: boolean) {

    if(Array.isArray(json)) {

        const readsPromises = (json as Array<Json>).map((val: Json, index: number) => {

            const newClassPath = [...classPath, `[${index}]`];

            return Serialize.reads(val, genericTypes, failFast, newClassPath, []);
        });

        return SerializeHelper.promiseAll(readsPromises, failFast)

    } else {
        return Promise.reject(SerializeError.readerError([...typePath, Array, genericTypes], `The value is not an array.`, classPath))
    }
};


FormatterRegistry.registerDefaultReader(arrayReader, Array);

export default arrayReader;