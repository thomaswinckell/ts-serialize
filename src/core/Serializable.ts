import "reflect-metadata";
import Writer from "../writer/Writer";
import Reader from "../reader/Reader";
import FormatterRegistry from "./FormatterRegistry";
import ObjectMetadata from "../metadata/ObjectMetadata";
import PropMetadata from "../metadata/PropMetadata";
import ISerializableDecorator from "./ISerializableDecorator";
import serializableReader from "../reader/SerializableReader";
import serializableWriter from "../writer/SerializableWriter";
import Serialize from "./Serialize";
import {PrototypeListDefinition, TypeDefinition, TypeListDefinition} from "./TypesDefinition";


function Serializable<T>(...genericTypes : (TypeListDefinition|PrototypeListDefinition|TypeDefinition<T>|Object)[]) : ISerializableDecorator<T> {

    let _name : string|undefined;
    let _writer : Writer<T>|undefined;
    let _reader : Reader<T>|undefined;

    const SerializableDecorator : any = (target: Object, classPropertyName: string) => {

        if(!_name) {
            _name = classPropertyName;
        }

        let types = [];
        let reflectedType = Reflect.getMetadata('design:type', target, classPropertyName);

        if(genericTypes[0] instanceof Array) {
            types = Serialize.extractPrototypes([reflectedType, ...genericTypes]);
        } else {
            types = Serialize.extractPrototypes([reflectedType, genericTypes]);
        }

        if(!_writer) {
            _writer = FormatterRegistry.getDefaultWriter(types[0]);
        }

        if(!_reader) {
            _reader = FormatterRegistry.getDefaultReader(types[0]);
        }

        const propMetadata = new PropMetadata(_name, classPropertyName, types, _writer, _reader);

        ObjectMetadata.registerProperty(target.constructor.prototype, propMetadata);

        FormatterRegistry.registerDefaultReader(serializableReader, target.constructor.prototype);
        FormatterRegistry.registerDefaultWriter(serializableWriter, target.constructor.prototype);
    };

    /**
     * Set the name of the json property
     */
    SerializableDecorator.names = function(jsonName: string): ISerializableDecorator<T> {
        _name = jsonName;
        return this;
    };

    /**
     * Set the function to apply when writing the property
     * (class -> json)
     */
    SerializableDecorator.writes = function(writer: Writer<T>): ISerializableDecorator<T> {
        _writer = writer;
        return this;
    };

    /**
     * Set the function to apply when reading the property
     * (json -> class)
     */
    SerializableDecorator.reads = function(reader: Reader<T>): ISerializableDecorator<T> {
        _reader = reader;
        return this;
    };

    return (SerializableDecorator as any);
}

export default Serializable;