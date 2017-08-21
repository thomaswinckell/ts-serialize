import Writer from "../writer/Writer";
import Reader from "../reader/Reader";
import Serializable from "../model/Serializable";
import ReaderWriterRegistry from "./ReaderWriterRegistry";
import ObjectMetadata from "../metadata/ObjectMetadata";
import PropMetadata from "../metadata/PropMetadata";
import ISerializeDecorator from "./ISerializeDecorator";
import PropTypes from "./PropTypes";


function Serialize<T>(...genericTypes : PropTypes) : ISerializeDecorator<T> {

    let _name : string|undefined;
    let _writer : Writer<T>|undefined;
    let _reader : Reader<T>|undefined;

    const SerializeDecorator : any = (target: Object, classPropertyName: string) => {

        if (!Serializable.prototype.isPrototypeOf(target)) {
            console.error(`Serialize decorator can only be used on a Serializable class.`);
            return;
        }

        if(!_name) {
            _name = classPropertyName;
        }

        let types = [];
        let reflectedType = Reflect.getMetadata('design:type', target, classPropertyName);

        if(!Array.isArray(genericTypes[0])) {
            types = [reflectedType, genericTypes];
        } else {
            types = [reflectedType, ...genericTypes];
        }

        if(!_writer) {
            _writer = ReaderWriterRegistry.getDefaultWriter(types);
        }

        if(!_reader) {
            _reader = ReaderWriterRegistry.getDefaultReader(types);
        }

        const propMetadata = new PropMetadata(_name, classPropertyName, types, _writer, _reader);

        ObjectMetadata.registerProperty(target, propMetadata);
    };

    /**
     * Set the name of the json property
     */
    SerializeDecorator.names = function(jsonName: string): ISerializeDecorator<T> {
        _name = jsonName;
        return this;
    };

    /**
     * Set the function to apply when writing the property
     * (class -> json)
     */
    SerializeDecorator.writes = function(writer: Writer<T>): ISerializeDecorator<T> {
        _writer = writer;
        return this;
    };

    /**
     * Set the function to apply when reading the property
     * (json -> class)
     */
    SerializeDecorator.reads = function(reader: Reader<T>): ISerializeDecorator<T> {
        _reader = reader;
        return this;
    };

    return (SerializeDecorator as any);
}

export default Serialize;