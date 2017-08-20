import ReaderWriterRegistry from "../core/ReaderWriterRegistry";
import Writer from "./Writer";


const defaultWriter: Writer<any> = function(value: any) {
    return Promise.resolve(value)
};

ReaderWriterRegistry.registerDefaultWriter(defaultWriter, [String]);
ReaderWriterRegistry.registerDefaultWriter(defaultWriter, [Number]);
ReaderWriterRegistry.registerDefaultWriter(defaultWriter, [Boolean]);

export default defaultWriter;