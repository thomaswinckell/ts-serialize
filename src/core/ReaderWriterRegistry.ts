import {flattenDeep} from "lodash";

import Writer from "../writer/Writer";
import Reader from "../reader/Reader";
import PropTypes from "./PropTypes";



namespace ReaderWriterRegistry {

    /**
     * Key/value store for default readers / writers.
     * The key is the reference to the type itself.
     * This should allows a good read performance.
     *
     * TODO : be shure it's safe to use a prototype as a key...
     */
    let stores = {
        writersStore : {},
        readersStore : {},
    };

    /**
     * Get the default writer for the given types
     */
    export function getDefaultWriter<T>(types : PropTypes) : Writer<T>|undefined {
        return getDefaultReaderWriter<Writer<T>>(types, stores.writersStore);
    }

    /**
     * Register a default writer for the given types
     */
    export function registerDefaultWriter<T>(writer : Writer<T>, types : PropTypes) {
        registerDefaultReaderWriter<Writer<T>>(writer, types, stores.writersStore);
    }

    /**
     * Get the default reader for the given types
     */
    export function getDefaultReader<T>(types : PropTypes) : Reader<T>|undefined {
        return getDefaultReaderWriter<Reader<T>>(types, stores.readersStore);
    }

    /**
     * Register a default reader for the given types
     */
    export function registerDefaultReader<T>(reader : Reader<T>, types : PropTypes) {
        registerDefaultReaderWriter<Reader<T>>(reader, types, stores.readersStore);
    }

    function getDefaultReaderWriter<T>(types : PropTypes, store : any) : T|undefined {

        const flattenTypes = flattenDeep(types) as any[];

        let currStore = store;

        for(let i = 0; i < flattenTypes.length; i++) {

            let idx = flattenTypes[i] as any;

            currStore = currStore[idx];

            if(!currStore) {
                return;
            }
        }

        return currStore.value;
    }

    function registerDefaultReaderWriter<T>(readerWriter : T, types : PropTypes, store : any) {

        const flattenTypes = flattenDeep(types) as any[];

        let currStore = store;

        for(let i = 0; i < flattenTypes.length; i++) {

            let idx = flattenTypes[i] as any;

            if(!currStore[idx]) {
                currStore[idx] = {};
            }

            currStore = currStore[idx];
        }

        currStore.value = readerWriter;
    }
}

export default ReaderWriterRegistry;