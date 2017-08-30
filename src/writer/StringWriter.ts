import ReaderWriterRegistry from "../core/ReaderWriterRegistry";
import Writer from "./Writer";


const stringWriter: Writer<string> = function(value: any) {
    return Promise.resolve(value)
};

ReaderWriterRegistry.registerDefaultWriter(stringWriter, String);

export default stringWriter;