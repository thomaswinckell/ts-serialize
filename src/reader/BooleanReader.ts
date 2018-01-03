import {JsValue} from "ts-json-definition";
import Reader from "./Reader";
import FormatterRegistry from "../core/FormatterRegistry";
import SerializeError from "../core/SerializeError";
import {TypeListDefinition} from "../core/TypesDefinition";
import {isBoolean} from "../utils/Validators";


const booleanReader: Reader<Boolean> = function(value: JsValue, prototype: Object, genericTypes: TypeListDefinition, classPath: string[], typePath: TypeListDefinition) {
    return new Promise((resolve, reject) => {
        if(isBoolean(value)) {
            resolve(value)
        } else {
            reject(SerializeError.readerError([...typePath, Boolean], `The value is not a boolean value.`, classPath))
        }
    })
};


FormatterRegistry.registerDefaultReader(booleanReader, Boolean);

export default booleanReader;