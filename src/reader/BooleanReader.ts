import {JsValue} from "ts-json-definition";
import Reader from "./Reader";
import ReaderWriterRegistry from "../core/ReaderWriterRegistry";


const booleanReader: Reader<Boolean> = function(value: JsValue) {
    return new Promise((resolve, reject) => {
        if(typeof value === 'boolean') {
            resolve(value)
        } else {
            reject(`The value is not a boolean value.`)
        }
    })
};


ReaderWriterRegistry.registerDefaultReader(booleanReader, [Boolean]);

export default booleanReader;