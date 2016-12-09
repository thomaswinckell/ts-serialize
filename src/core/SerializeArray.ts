import {Unmarshaller, defaultUnmarshaller, Marshaller, defaultMarshaller} from "./Transformer"
import Constructor from "../utils/Constructor"
import {JsValue, Json, JsArray} from "ts-json-definition"
import UnmarshallError from "../error/UnmarshallError"
import {Either, Left, Right, Optional, Some} from "scalts"
import Serialize from "./Serialize"
import {isDefined} from "../utils"


export const SerializeArray = function< T >( type : Function, jsonPropertyName ?: string, unmarshaller : Unmarshaller< T > = defaultUnmarshaller, marshaller : Marshaller< T > = defaultMarshaller ) {

    const arrayUnmarshaller : Unmarshaller< Array< T > > = (value : JsValue, json : Json, clazz : any, jsonPropertyName : string, classPropertyName : string, target : Constructor< any >, mbType : Optional< Function >, jsonPath : string[], classPath : string[]) : Either< UnmarshallError[], Array< T > > => {

        if( !Array.isArray(value) ) {

            // if there is a default value
            if(isDefined(clazz[classPropertyName])) {
                return Right< UnmarshallError[],any >(clazz[classPropertyName]);
            }

            return Left< UnmarshallError[], Array< T > >([new UnmarshallError(value, Some(Array), jsonPropertyName, classPropertyName, target, jsonPath, classPath )]);

        } else {

            return (<JsArray>value).reduce< Either< UnmarshallError[], Array< T > > >( ( acc : Either< UnmarshallError[], Array< T > >, curr : JsValue ) => {

                if( acc.isLeft ) { return acc; }

                const currRes = unmarshaller(curr, json, clazz, jsonPropertyName, classPropertyName, target, mbType, jsonPath, classPath);

                if( currRes.isLeft ) { return Left< UnmarshallError[], Array< T > >( currRes.left().get() ); }

                return Right< UnmarshallError[], Array< T > >( acc.right().get().concat( currRes.right().get() ) );

            }, Right< UnmarshallError[], Array< T > >([]) );
        }
    };

    const arrayMarshaller : Marshaller< Array< T > > = (value : Array< T >, json : Json, clazz : any, jsonPropertyName : string, classPropertyName : string, target : Constructor< any >, mbType : Optional< Function >) => {
        return (<JsValue>value.map( v => marshaller( v, json, clazz, jsonPropertyName, classPropertyName, target, mbType ) ));
    };

    return Serialize< Array< T > >(jsonPropertyName, arrayUnmarshaller, arrayMarshaller, Some(type));
};

export default SerializeArray
