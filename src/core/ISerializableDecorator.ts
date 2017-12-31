import Writer from "../writer/Writer";
import Reader from "../reader/Reader";

/**
 * Interface implemented by all Serializable decorators
 */
export interface ISerializable<T> {

    /**
     * Set the name of the json property
     */
    names(jsonName : string) : ISerializableDecorator<T>;

    /**
     * Set the function to apply when writing the property
     * (class -> json)
     */
    writes(writer : Writer<T>) : ISerializableDecorator<T>;

    /**
     * Set the function to apply when reading the property
     * (json -> class)
     */
    reads(reader : Reader<T>) : ISerializableDecorator<T>;
}


export type ISerializableDecorator<T> = ISerializable<T>&Function;


export default ISerializableDecorator;