import {Either} from "scalts"
import {Json} from "ts-json-definition"

import UnmarshallError from "../errors/UnmarshallError"

interface FieldSerializer {
    unmarshaller        : (value : any, json : Json, clazz : any, jsonPath : string[], classPath : string[]) => Either< UnmarshallError[], any >;
    marshaller          : (value : any, json : Json, clazz : any) => any;
    classPropertyName   : string;
    jsonPropertyName    : string;
}

export default FieldSerializer