import Writer from "../writer/Writer";
import Reader from "../reader/Reader";



namespace FormatterRegistry {

    /**
     * Key/value store for default readers / writers.
     * The key is the reference to the type itself.
     * This should allows a good read performance.
     *
     * TODO : use something else than the prototype name, it will not work after uglify...
     */
    let writersStore = {};
    let readersStore = {};

    function typeToPrototype(type: Object|{new (...args: any[]): any;}) : any {
        return (type as any).prototype ? (type as any).prototype : type;
    }

    /**
     * Get the default writer for the given types
     */
    export function getDefaultWriter<T>(type: Object|{new (...args: any[]): T;}) : Writer|undefined {
        return writersStore[typeToPrototype(type).constructor.name];
    }

    /**
     * Register a default writer for the given types
     */
    export function registerDefaultWriter<T>(writer : Writer, type: Object|{new (...args: any[]): T;}) {
        writersStore[typeToPrototype(type).constructor.name] = writer;
    }

    /**
     * Get the default reader for the given types
     */
    export function getDefaultReader<T>(type : Object) : Reader<T>|undefined {
        return readersStore[typeToPrototype(type).constructor.name];
    }

    /**
     * Register a default reader for the given types
     */
    export function registerDefaultReader<T>(reader : Reader<T>, type : Object|{new (...args: any[]): T;}) {
        readersStore[typeToPrototype(type).constructor.name] = reader;
    }
}

export default FormatterRegistry;