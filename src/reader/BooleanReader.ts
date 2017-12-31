import {JsValue} from "ts-json-definition";
import Reader from "./Reader";
import FormatterRegistry from "../core/FormatterRegistry";
import SerializeError from "../model/SerializeError";
import {PrototypeListDefinition} from "../core/TypesDefinition";


const booleanReader: Reader<Boolean> = function(value: JsValue, prototype: Object, genericTypes: PrototypeListDefinition, classPath: string[]) {
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