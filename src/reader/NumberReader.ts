import {JsValue} from "ts-json-definition";
import Reader from "./Reader";
import FormatterRegistry from "../core/FormatterRegistry";
import SerializeError from "../core/SerializeError";
import {TypeListDefinition} from "../core/TypesDefinition";


const numberReader: Reader<Number> = function(value: JsValue, prototype: Object, genericTypes: TypeListDefinition, classPath: string[], typePath: TypeListDefinition) {
    return new Promise((resolve, reject) => {
        if(typeof value === 'number' && !Number.isNaN(value)) {
            resolve(value)
        } else {
            reject(SerializeError.readerError([...typePath, Number], `The value is not a number value.`, classPath))
        }
    })
};


FormatterRegistry.registerDefaultReader(numberReader, Number);

export default numberReader;