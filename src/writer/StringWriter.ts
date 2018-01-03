import FormatterRegistry from "../core/FormatterRegistry";
import Writer from "./Writer";
import {TypeListDefinition} from "../core/TypesDefinition";
import {isString} from "../utils/Validators";
import SerializeError from "../core/SerializeError";


const stringWriter: Writer = function(value: any, prototype: Object, genericTypes: TypeListDefinition, classPath: string[], typePath: TypeListDefinition) {
    if(isString(value)) {
        return Promise.resolve(value)
    } else {
        return Promise.reject(SerializeError.writerError([...typePath, String], `The value is not a string.`, classPath))
    }
};

FormatterRegistry.registerDefaultWriter(stringWriter, String);

export default stringWriter;