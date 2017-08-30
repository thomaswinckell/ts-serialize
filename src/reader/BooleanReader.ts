import {JsValue} from "ts-json-definition";
import Reader from "./Reader";
import FormatterRegistry from "../core/FormatterRegistry";
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


FormatterRegistry.registerDefaultReader(booleanReader, Boolean);

export default booleanReader;