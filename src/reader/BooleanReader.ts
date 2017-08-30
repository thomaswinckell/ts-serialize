import {JsValue} from "ts-json-definition";
import Reader from "./Reader";
import ReaderWriterRegistry from "../core/ReaderWriterRegistry";
import SerializeError from "../model/SerializeError";


const booleanReader: Reader<Boolean> = function(value: JsValue, genericTypes: Object[], classPath: string[]) {
    return new Promise((resolve, reject) => {
        if(typeof value === 'boolean') {
            resolve(value)
        } else {
            reject(SerializeError.readerError([Boolean], `The value is not a boolean value.`, classPath))
        }
    })
};


ReaderWriterRegistry.registerDefaultReader(booleanReader, Boolean);

export default booleanReader;