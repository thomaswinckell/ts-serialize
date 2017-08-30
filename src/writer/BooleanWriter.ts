import ReaderWriterRegistry from "../core/ReaderWriterRegistry";
import Writer from "./Writer";


const booleanWriter: Writer<boolean> = function(value: any) {
    return Promise.resolve(value)
};

ReaderWriterRegistry.registerDefaultWriter(booleanWriter, Boolean);

export default booleanWriter;