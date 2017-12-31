import {JsValue} from "ts-json-definition";
import Reader from "./Reader";
import SerializeError from "../model/SerializeError";
import Serialize from "../core/Serialize";
import {PrototypeListDefinition} from "../core/TypesDefinition";
import ObjectMetadata from "../metadata/ObjectMetadata";



export default function(objectMetadata: ObjectMetadata) : Reader<any> {

    return function(json: JsValue, prototype: Object, genericTypes: PrototypeListDefinition, classPath: string[], failFast: boolean) {

        if(json) {

            let obj = new (prototype.constructor as any)();

            const readsPromises = Object.keys(objectMetadata).map(propName => {

                const propMetadata = objectMetadata[propName];

                return new Promise((resolve, reject) => {

                    const newClassPath = classPath.length === 0 ?
                        [(prototype.constructor as any).name, `.${propMetadata.propName}`] :
                        [...classPath, `.${propMetadata.propName}`];

                    Serialize.readsFromMetadata(propMetadata, json[propMetadata.jsonName], newClassPath, failFast)
                        .then(value => resolve({value, propMetadata}))
                        .catch(reject)
                })
            });

            return new Promise((resolve, reject) => {

                Serialize.promiseAll(readsPromises, failFast).then((readsResults: any[]) => {

                    readsResults.forEach(res => {
                        obj[res.propMetadata.propName] = res.value;
                    });

                    resolve(obj);

                }).catch(reject);
            });
        } else {
            return Promise.reject(SerializeError.readerError([prototype, genericTypes], `Serializable value should be an object.`, classPath))
        }
    };
};