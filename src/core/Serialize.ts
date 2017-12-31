import {JsValue} from "ts-json-definition";
import {TypeDefinition, PrototypeListDefinition, TypeListDefinition} from "./TypesDefinition";
import FormatterRegistry from "./FormatterRegistry";
import SerializeError from "./SerializeError";
import SerializeHelper from "./SerializeHelper";



namespace Serialize {

    export function reads<T>(value: JsValue, types: TypeListDefinition|PrototypeListDefinition|TypeDefinition<T>|Object, classPath: string[] = [], failFast: boolean = true) : Promise<T> {

        const prototypes = SerializeHelper.extractPrototypes(types);
        const type = SerializeHelper.firstTypeFromTypes(prototypes);
        const genericTypes = SerializeHelper.genericTypesFromTypes(prototypes);
        const reader = FormatterRegistry.getDefaultReader(type);

        if(reader) {
            return reader(value, type, genericTypes, classPath, failFast) as Promise<T>;
        }

        return Promise.reject(SerializeError.undefinedReaderError(prototypes, classPath))
    }

    export function writes(value: any, types: TypeListDefinition|PrototypeListDefinition|TypeDefinition<any>|Object, classPath: string[] = [], failFast: boolean = true) : Promise<JsValue> {

        const prototypes = SerializeHelper.extractPrototypes(types);
        const type = SerializeHelper.firstTypeFromTypes(prototypes);
        const genericTypes = SerializeHelper.genericTypesFromTypes(prototypes);
        const writer = FormatterRegistry.getDefaultWriter(type);

        if(writer) {
            return writer(value, type, genericTypes, classPath, failFast);
        }

        return Promise.reject(SerializeError.undefinedWriterError(prototypes, classPath))
    }
}

export default Serialize;