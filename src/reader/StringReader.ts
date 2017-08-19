import {JsValue} from "ts-json-definition";
import Reader from "./Reader";
import ReaderWriterRegistry from "../core/ReaderWriterRegistry";


const stringReader: Reader<String> = function(value: JsValue) {
    return new Promise((resolve, reject) => {
        if(typeof value === 'string') {
            resolve(value)
        } else {
            reject(`The value is not a string value.`)
        }
    })
};

ReaderWriterRegistry.registerDefaultReader(stringReader, [String]);

export default stringReader;