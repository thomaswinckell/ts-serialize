import Writer from "../writer/Writer";
import Reader from "../reader/Reader";

/**
 * Interface implemented by all Serialize decorators
 */
export interface ISerialize<T> {

    /**
     * Set the name of the json property
     */
    names(jsonName : string) : ISerializeDecorator<T>;

    /**
     * Set the function to apply when writing the property
     * (class -> json)
     */
    writes(writer : Writer<T>) : ISerializeDecorator<T>;

    /**
     * Set the function to apply when reading the property
     * (json -> class)
     */
    reads(reader : Reader<T>) : ISerializeDecorator<T>;
}


export type ISerializeDecorator<T> = ISerialize<T>&Function;


export default ISerializeDecorator;