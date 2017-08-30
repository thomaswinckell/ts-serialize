import Writer from "../writer/Writer";
import Reader from "../reader/Reader";



namespace ReaderWriterRegistry {

    /**
     * Key/value store for default readers / writers.
     * The key is the reference to the type itself.
     * This should allows a good read performance.
     *
     * TODO : be sure it's safe to use a prototype as a key...
     */
    let writersStore = {};
    let readersStore = {};

    /**
     * Get the default writer for the given types
     */
    export function getDefaultWriter<T>(type : Object) : Writer<T>|undefined {
        return writersStore[type as any];
    }

    /**
     * Register a default writer for the given types
     */
    export function registerDefaultWriter<T>(writer : Writer<T>, type : Object) {
        writersStore[type as any] = writer;
    }

    /**
     * Get the default reader for the given types
     */
    export function getDefaultReader<T>(type : Object) : Reader<T>|undefined {
        return readersStore[type as any];
    }

    /**
     * Register a default reader for the given types
     */
    export function registerDefaultReader<T>(reader : Reader<T>, type : Object) {
        readersStore[type as any] = reader;
    }
}

export default ReaderWriterRegistry;