import FormatterRegistry from "../core/FormatterRegistry";
import Writer from "./Writer";


const numberWriter: Writer<number> = function(value: any) {
    return Promise.resolve(value)
};

FormatterRegistry.registerDefaultWriter(numberWriter, Number);

export default numberWriter;