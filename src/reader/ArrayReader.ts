import {Json, JsValue} from "ts-json-definition";
import Reader from "./Reader";
import FormatterRegistry from "../core/FormatterRegistry";
import Serialize from "../core/Serialize";
import SerializeError from "../model/SerializeError";
import {PrototypeListDefinition} from "../core/TypesDefinition";



const arrayReader: Reader<any[]> = function(json: JsValue, prototype: Object, genericTypes: PrototypeListDefinition, classPath: string[], failFast: boolean) {

    if(Array.isArray(json)) {

        const readsPromises = (json as Array<Json>).map((val: Json, index: number) => {

            const newClassPath = [...classPath, `[${index}]`];

            return Serialize.reads(val, genericTypes, newClassPath, failFast);
        });

        return Serialize.promiseAll(readsPromises, failFast)

    } else {
        return Promise.reject(SerializeError.readerError([Array, genericTypes], `The value is not an array.`, classPath))
    }
};


FormatterRegistry.registerDefaultReader(arrayReader, Array);

export default arrayReader;