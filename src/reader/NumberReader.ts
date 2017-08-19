import {JsValue} from "ts-json-definition";
import Reader from "./Reader";
import ReaderWriterRegistry from "../core/ReaderWriterRegistry";


const numberReader: Reader<Number> = function(value: JsValue) {
    return new Promise((resolve, reject) => {
        if(typeof value === 'number') {
            resolve(value)
        } else if(typeof value === 'string' && !isNaN(+value)) {
            resolve(+value)
        } else {
            reject(`The value is not a number value.`)
        }
    })
};


ReaderWriterRegistry.registerDefaultReader(numberReader, [Number]);

export default numberReader;