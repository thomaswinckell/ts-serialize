import FormatterRegistry from "../core/FormatterRegistry";
import Writer from "./Writer";


const stringWriter: Writer<string> = function(value: any) {
    return Promise.resolve(value)
};

FormatterRegistry.registerDefaultWriter(stringWriter, String);

export default stringWriter;