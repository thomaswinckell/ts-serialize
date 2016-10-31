import {UnmarshallError} from "../error/UnmarshallError";
import {Either} from "../utils/Either";
import {Json} from "../utils/Json";

interface FieldSerializer {
    unmarshaller        : (value : any, json : Json, clazz : any, jsonPath : string[], classPath : string[]) => Either< UnmarshallError[], any >;
    marshaller          : (value : any, json : Json, clazz : any) => any;
    classPropertyName   : string;
    jsonPropertyName    : string;
}

export default FieldSerializer;