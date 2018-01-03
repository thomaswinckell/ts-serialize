import FormatterRegistry from "../core/FormatterRegistry";
import Writer from "./Writer";
import {isBoolean} from "../utils/Validators";
import SerializeError from "../core/SerializeError";
import {TypeListDefinition} from "../core/TypesDefinition";


const booleanWriter: Writer = function(value: any, prototype: Object, genericTypes: TypeListDefinition, classPath: string[], typePath: TypeListDefinition) {
    if(isBoolean(value)) {
        return Promise.resolve(value)
    } else {
        return Promise.reject(SerializeError.writerError([...typePath, Boolean], `The value is not a boolean.`, classPath))
    }
};

FormatterRegistry.registerDefaultWriter(booleanWriter, Boolean);

export default booleanWriter;