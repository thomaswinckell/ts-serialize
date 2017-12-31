import FormatterRegistry from "./FormatterRegistry";
import {PropMetadata} from "./ObjectMetadata";
import serializableReader from "../reader/SerializableReader";
import serializableWriter from "../writer/SerializableWriter";
import {PrototypeListDefinition, TypeDefinition, TypeListDefinition} from "./TypesDefinition";
import SerializeHelper from "./SerializeHelper";


export type SerializableArgs = {
    [key: string]: TypeListDefinition|PrototypeListDefinition|TypeDefinition<any>|Object
}

function Serializable<T>(args : SerializableArgs) {

    return function(target: any, classPropertyName?: string) {

        if(classPropertyName) {
            throw '@Serializable should be used on a class, not on a class property';
        }

        let objectMetadata = {};

        Object.keys(args).forEach(propertyName => {
            objectMetadata[propertyName] = new PropMetadata(propertyName, propertyName, SerializeHelper.extractPrototypes(args[propertyName]));
        });

        FormatterRegistry.registerDefaultReader(serializableReader(objectMetadata), target.prototype);
        FormatterRegistry.registerDefaultWriter(serializableWriter(objectMetadata), target.prototype);
    }
}

export default Serializable;