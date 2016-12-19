import 'reflect-metadata'
import {Either, Right, Left} from "scalts"
import {JsObject, JsArray} from "ts-json-definition"

import UnmarshallError from "../errors/UnmarshallError"
import Constructor from "../utils/Constructor"
import SerializersMapper from "./SerializersMapper"


abstract class Serializable {

    static fromString< T >(str: string): Either< Error[], T > {
        try {
            const json = JSON.parse(str);
            return this.fromJsObject< T >(json);
        } catch (e) {
            return Left< Error[], T >(e);
        }
    }

    static fromStringAsArray< T >(str: string): Either< Error[], Array< T > > {
        try {
            const json = JSON.parse(str);
            return this.fromJsArray< T >(json);
        } catch (e) {
            return Left< Error[], Array< T > >(e);
        }
    }

    static fromJsObject< T >(jsObject: JsObject, jsonPath: string[] = [], classPath: string[] = []): Either< Error[], T > {
        let entity = new (< Constructor< T > >this.prototype.constructor)();
        let serializeErrors: Error[] = [];

        SerializersMapper.getFieldSerializers(this.prototype).forEach(prop => {
            const unmarshallResult = (<Either< Error[], any >>prop.unmarshaller(jsObject[prop.jsonPropertyName], jsObject, entity, jsonPath, classPath));
            if (unmarshallResult.isLeft) {
                serializeErrors.push(...unmarshallResult.left().get());
            } else if (serializeErrors.isEmpty) {
                entity[prop.classPropertyName] = unmarshallResult.right().get();
            }
        });

        return serializeErrors.isEmpty ? Right< UnmarshallError[], T >(entity) : Left< Error[], T >(serializeErrors);
    }

    static fromJsArray< T >(jsArray: JsArray, jsonPath: string[] = [], classPath: string[] = []): Either< Error[], T[] > {
        let entities: T[] = [];
        let serializeErrors: Error[] = [];

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

        return serializeErrors.isEmpty ? Right< UnmarshallError[], T[] >(entities) : Left< Error[], T[] >(serializeErrors);
    }

    toJson(): JsObject {
        let obj = {};
        SerializersMapper.getFieldSerializers(this.constructor.prototype).forEach(prop => {
            obj[prop.jsonPropertyName] = prop.marshaller(this[prop.classPropertyName], obj, this);
        });
        return obj;
    }

    toString(tabLength: number = 4): string {
        return JSON.stringify(this, null, tabLength);
    }
}

export default Serializable;
