import {JsValue} from "ts-json-definition";
import Reader from "./Reader";
import FormatterRegistry from "../core/FormatterRegistry";
import SerializeError from "../core/SerializeError";
import {TypeListDefinition} from "../core/TypesDefinition";


const stringReader: Reader<String> = function(value: JsValue, prototype: Object, genericTypes: TypeListDefinition, classPath: string[], typePath: TypeListDefinition) {
    return new Promise((resolve, reject) => {
        if(typeof value === 'string') {
            resolve(value)
        } else {
            reject(SerializeError.readerError([...typePath, String], `The value is not a string value.`, classPath))
        }
    })
};

FormatterRegistry.registerDefaultReader(stringReader, String);

export default stringReader;