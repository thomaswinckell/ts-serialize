import "reflect-metadata";
import FormatterRegistry from "./FormatterRegistry";
import {PropMetadata} from "../metadata/ObjectMetadata";
import serializableReader from "../reader/SerializableReader";
import serializableWriter from "../writer/SerializableWriter";
import {PrototypeListDefinition, TypeDefinition, TypeListDefinition} from "./TypesDefinition";
import MetadataHelper from "../metadata/MetadataHelper";
import Serialize from "./Serialize";


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
            objectMetadata[propertyName] = new PropMetadata(propertyName, propertyName, Serialize.extractPrototypes(args[propertyName]));
        });

        MetadataHelper.registerMetadata(target.prototype, objectMetadata);

        FormatterRegistry.registerDefaultReader(serializableReader, target.prototype);
        FormatterRegistry.registerDefaultWriter(serializableWriter, target.prototype);
    }
}

export default Serializable;