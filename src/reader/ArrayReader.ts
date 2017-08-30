import {Json, JsValue} from "ts-json-definition";
import Reader from "./Reader";
import ReaderWriterRegistry from "../core/ReaderWriterRegistry";
import SerializeHelper from "../core/SerializeHelper";
import SerializeError from "../model/SerializeError";



const arrayReader: Reader<any[]> = function(json: JsValue, genericTypes: Object[], classPath: string[], failFast: boolean) {

    if(Array.isArray(json)) {

        const readsPromises = (json as Array<Json>).map((val: Json, index: number) => {

            const newClassPath = [...classPath, `[${index}]`];

            return SerializeHelper.defaultReads(val, genericTypes, newClassPath, failFast);
        });

        return SerializeHelper.promiseAll(readsPromises, failFast)

    } else {
        return Promise.reject(SerializeError.readerError([Array, genericTypes], `The value is not an array.`, classPath))
    }
};


ReaderWriterRegistry.registerDefaultReader(arrayReader, Array);

export default arrayReader;