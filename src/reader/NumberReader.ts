import {JsValue} from "ts-json-definition";
import Reader from "./Reader";
import ReaderWriterRegistry from "../core/ReaderWriterRegistry";
import SerializeError from "../model/SerializeError";


const numberReader: Reader<Number> = function(value: JsValue, genericTypes: Object[], classPath: string[]) {
    return new Promise((resolve, reject) => {
        if(typeof value === 'number' && !Number.isNaN(value)) {
            resolve(value)
        } else {
            reject(SerializeError.readerError([Number], `The value is not a number value.`, classPath))
        }
    })
};


ReaderWriterRegistry.registerDefaultReader(numberReader, Number);

export default numberReader;