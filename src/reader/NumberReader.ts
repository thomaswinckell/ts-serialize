import {JsValue} from "ts-json-definition";
import Reader from "./Reader";
import FormatterRegistry from "../core/FormatterRegistry";
import SerializeError from "../core/SerializeError";
import {PrototypeListDefinition} from "../core/TypesDefinition";


const numberReader: Reader<Number> = function(value: JsValue, prototype: Object, genericTypes: PrototypeListDefinition, classPath: string[]) {
    return new Promise((resolve, reject) => {
        if(typeof value === 'number' && !Number.isNaN(value)) {
            resolve(value)
        } else {
            reject(SerializeError.readerError([Number], `The value is not a number value.`, classPath))
        }
    })
};


FormatterRegistry.registerDefaultReader(numberReader, Number);

export default numberReader;