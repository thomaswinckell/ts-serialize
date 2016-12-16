import {JsValue, Json} from "ts-json-definition"
import {Optional, Some, Either, Right, Left} from "scalts"

import UnmarshallError from "../errors/UnmarshallError"
import Serializable from "../core/Serializable"
import {isDefined} from "../utils"


export type Marshaller< T > = (value: T, json: Json, clazz: any, classPropertyName: string, jsonPropertyName: string, target: Function, mbType: Optional< Function >) => JsValue;

export type Unmarshaller< T > = (value: JsValue, json: Json, clazz: any, classPropertyName: string, jsonPropertyName: string, target: Function, mbType: Optional< Function >, jsonPath: string[], classPath: string[]) => Either< UnmarshallError[], T >;


export const defaultMarshaller: Marshaller< any > = (value: any, json: Json, clazz: any, classPropertyName: string, jsonPropertyName: string, target: Function, mbType: Optional< Function >): JsValue => {

    const undefinedValue = null;

    return mbType.fold(value, (type: Function) => {

        if (type === Optional) {
            return value.getOrElse(undefinedValue);
        }

        if (Serializable.prototype.isPrototypeOf(type.prototype)) {
            return value.toJson();
        }

        return value;
    });
};


export const defaultUnmarshaller: Unmarshaller< any > = (value: JsValue, json: Json, clazz: any, classPropertyName: string, jsonPropertyName: string, target: Function, mbType: Optional< Function >, jsonPath: string[], classPath: string[]) => {

    // if the value is not define and there is a default value
    if (!isDefined(value) && isDefined(clazz[classPropertyName])) {
        return Right< UnmarshallError[],any >(clazz[classPropertyName]);
    }

    return mbType.fold(Right< UnmarshallError[], any >(value), (type: Function) => {

        if (type === String) {
            return stringUnmarshaller(value, json, clazz, classPropertyName, jsonPropertyName, target, mbType, jsonPath, classPath);
        }

        if (type === Number) {
            return numberUnmarshaller(value, json, clazz, classPropertyName, jsonPropertyName, target, mbType, jsonPath, classPath);
        }

        if (Serializable.prototype.isPrototypeOf(type.prototype)) {
            return type.prototype.constructor.fromJsObject(value, jsonPath, classPath);
        }

        const additionalMessage = `No unmarshaller found for type ${type['name']}`;
        return Left< UnmarshallError[], number >([new UnmarshallError(value, Some(type), jsonPropertyName, classPropertyName, target, jsonPath, classPath, Some(additionalMessage))]);
    });
};


const stringUnmarshaller: Unmarshaller< string > = (value: JsValue, json: Json, clazz: any, classPropertyName: string, jsonPropertyName: string, target: Function, mbType: Optional< Function >, jsonPath: string[], classPath: string[]) => {
    if (typeof value === 'string') {
        return Right< UnmarshallError[], string >(value);
    }
    return Left< UnmarshallError[], string >([new UnmarshallError(value, Some(String), jsonPropertyName, classPropertyName, target, jsonPath, classPath)]);
};


const numberUnmarshaller: Unmarshaller< number > = (value: JsValue, json: Json, clazz: any, classPropertyName: string, jsonPropertyName: string, target: Function, mbType: Optional< Function >, jsonPath: string[], classPath: string[]) => {
    if (typeof value === 'number') {
        return Right< UnmarshallError[],number >(value);
    }
    if (typeof value === 'string' && !isNaN(+value)) {
        return Right< UnmarshallError[],number >(+value);
    }
    return Left< UnmarshallError[], number >([new UnmarshallError(value, Some(Number), jsonPropertyName, classPropertyName, target, jsonPath, classPath)]);
};