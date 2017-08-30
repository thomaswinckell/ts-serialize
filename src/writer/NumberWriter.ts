import ReaderWriterRegistry from "../core/ReaderWriterRegistry";
import Writer from "./Writer";


const numberWriter: Writer<number> = function(value: any) {
    return Promise.resolve(value)
};

ReaderWriterRegistry.registerDefaultWriter(numberWriter, Number);

export default numberWriter;