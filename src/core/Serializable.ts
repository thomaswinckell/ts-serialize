import 'reflect-metadata';

import {Either, Right, Left} from "scalts";
import JsonParseError from "../error/JsonParseError";
import {UnmarshallError} from "../error/UnmarshallError";
import Constructor from "../utils/Constructor";

import FieldsMapper from "./FieldsMapper";
import IError from "../error/IError";
import {JsObject} from "ts-json-definition";


abstract class Serializable< T > {

    constructor() {}

    static fromString< T >( str : string ) : Either< IError[], T > {
        try {
            const json = JSON.parse( str );
            return this.fromJson< T >( json );
        } catch (e) {
            console.error( `Error while serializing into an object`, e, str );
            return Left< IError[], T >( [ new JsonParseError( str ) ] );
        }
    }

    static fromJson< T >( json : JsObject, jsonPath : string[] = [], classPath : string[] = [] ) : Either< UnmarshallError[], T > {
        const constructor = (< Constructor< T > >this.prototype.constructor);
        let obj = new constructor();
        let serializeErrors = [];
        FieldsMapper.getFieldByConstructorName(constructor.name).forEach(prop => {
            const res = (<Either< UnmarshallError[], any >>prop.unmarshaller(json[prop.jsonPropertyName], json, obj, jsonPath, classPath));
            if(res.isLeft) {
                serializeErrors.push( ...res.left().get() );
            } else if(res.isRight) {
                const value = res.right().get();
                obj[prop.classPropertyName] = value;
            }
        });
        return serializeErrors.length === 0 ? Right< UnmarshallError[], T >( obj ) : Left< UnmarshallError[], T >( serializeErrors );
    }

    toJson() : JsObject {
        let obj = {};
        FieldsMapper.getFieldByConstructorName(this.constructor['name']).forEach(prop => {
            obj[prop.jsonPropertyName] = prop.marshaller(this[prop.classPropertyName], obj, this);
        });
        return obj;
    }

    toString( tabLength : number = 4 ) : string {
        return JSON.stringify( this, null, tabLength );
    }
}

export default Serializable;
