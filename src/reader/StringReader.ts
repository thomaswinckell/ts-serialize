import {JsValue} from "ts-json-definition";
import Reader from "./Reader";
import FormatterRegistry from "../core/FormatterRegistry";
import SerializeError from "../model/SerializeError";


const stringReader: Reader<String> = function(value: JsValue, genericTypes: Object[], classPath: string[]) {
    return new Promise((resolve, reject) => {
        if(typeof value === 'string') {
            resolve(value)
        } else {
            reject(SerializeError.readerError([String], `The value is not a string value.`, classPath))
        }
    })
};

FormatterRegistry.registerDefaultReader(stringReader, String);

export default stringReader;