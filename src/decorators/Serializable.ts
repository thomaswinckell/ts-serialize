import FormatterRegistry from "../core/FormatterRegistry";
import {PropMetadata} from "../metadata/ObjectMetadata";
import serializableReader from "../reader/SerializableReader";
import serializableWriter from "../writer/SerializableWriter";
import {ArgsTypeListDefinition} from "../core/TypesDefinition";
import MetadataHelper from "../metadata/MetadataHelper";
import SerializeHelper from "../core/SerializeHelper";


export type SerializableArgs = {
    [key: string]: ArgsTypeListDefinition<any>
}

function Serializable(args : SerializableArgs) {

    return function(target: any, classPropertyName?: string) {

        if(classPropertyName) {
            throw '@Serializable should be used on a class, not on a class property';
        }

        let objectMetadata = {};

        Object.keys(args).forEach(propertyName => {
            objectMetadata[propertyName] = {
                propName: propertyName,
                types: SerializeHelper.extractPrototypes(args[propertyName])
            } as PropMetadata<any>;
        });

        MetadataHelper.registerMetadata(target.prototype, objectMetadata);

        FormatterRegistry.registerDefaultReader(serializableReader, target.prototype);
        FormatterRegistry.registerDefaultWriter(serializableWriter, target.prototype);
    }
}

export default Serializable;