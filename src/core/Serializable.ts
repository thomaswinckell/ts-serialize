import 'reflect-metadata'

import {Either, Right, Left} from "scalts"
import JsonParseError from "../error/JsonParseError"
import UnmarshallError from "../error/UnmarshallError"
import Constructor from "../utils/Constructor"

import FieldsMapper from "./FieldsMapper"
import {JsObject, JsArray} from "ts-json-definition"


abstract class Serializable {

    static fromString< T >(str: string): Either< Error[], T > {
        try {
            const json = JSON.parse(str);
            return this.fromJsObject< T >(json);
        } catch (e) {
            return Left< Error[], T >([new JsonParseError(str)]);
        }
    }

    static fromStringAsArray< T >(str: string): Either< Error[], Array< T > > {
        try {
            const json = JSON.parse(str);
            return this.fromJsArray< T >(json);
        } catch (e) {
            return Left< Error[], Array< T > >([new JsonParseError(str)]);
        }
    }

    static fromJsObject< T >(jsObject: JsObject, jsonPath: string[] = [], classPath: string[] = []): Either< UnmarshallError[], T > {
        const constructor = (< Constructor< T > >this.prototype.constructor);
        let entity = new constructor();
        let serializeErrors: UnmarshallError[] = [];

        FieldsMapper.getFieldByConstructorName(constructor.name).forEach(prop => {
            const unmarshallResult = (<Either< UnmarshallError[], any >>prop.unmarshaller(jsObject[prop.jsonPropertyName], jsObject, entity, jsonPath, classPath));
            if (unmarshallResult.isLeft) {
                serializeErrors.push(...unmarshallResult.left().get());
            } else if (serializeErrors.isEmpty) {
                entity[prop.classPropertyName] = unmarshallResult.right().get();
            }
        });

        return serializeErrors.isEmpty ? Right< UnmarshallError[], T >(entity) : Left< UnmarshallError[], T >(serializeErrors);
    }

    static fromJsArray< T >(jsArray: JsArray, jsonPath: string[] = [], classPath: string[] = []): Either< UnmarshallError[], T[] > {
        let entities: T[] = [];
        let serializeErrors: UnmarshallError[] = [];

        jsArray.forEach((jsObject: JsObject, index: number) => {

            const newJsonPath = [...jsonPath, `[${index}]`];
            const newClassPath = [...classPath, `[${index}]`];

            const unmarshallResult = this.fromJsObject< T >(jsObject, newJsonPath, newClassPath);

            if (unmarshallResult.isLeft) {
                serializeErrors.push(...unmarshallResult.left().get());
            } else if (serializeErrors.isEmpty) {
                entities.push(unmarshallResult.right().get());
            }
        });

        return serializeErrors.isEmpty ? Right< UnmarshallError[], T[] >(entities) : Left< UnmarshallError[], T[] >(serializeErrors);
    }

    toJson(): JsObject {
        let obj = {};
        FieldsMapper.getFieldByConstructorName(this.constructor['name']).forEach(prop => {
            obj[prop.jsonPropertyName] = prop.marshaller(this[prop.classPropertyName], obj, this);
        });
        return obj;
    }

    toString(tabLength: number = 4): string {
        return JSON.stringify(this, null, tabLength);
    }
}

export default Serializable;
