import FormatterRegistry from "../core/FormatterRegistry";
import Writer from "./Writer";


const booleanWriter: Writer<boolean> = function(value: any) {
    return Promise.resolve(value)
};

FormatterRegistry.registerDefaultWriter(booleanWriter, Boolean);

export default booleanWriter;