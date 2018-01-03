import FormatterRegistry from "../core/FormatterRegistry";
import Writer from "./Writer";
import {isNumber} from "../utils/Validators";
import SerializeError from "../core/SerializeError";
import {TypeListDefinition} from "../core/TypesDefinition";


const numberWriter: Writer = function(value: any, prototype: Object, genericTypes: TypeListDefinition, classPath: string[], typePath: TypeListDefinition) {
    if(isNumber(value)) {
        return Promise.resolve(value)
    } else {
        return Promise.reject(SerializeError.writerError([...typePath, Number], `The value is not a number.`, classPath))
    }
};

FormatterRegistry.registerDefaultWriter(numberWriter, Number);

export default numberWriter;