import {JsValue} from "ts-json-definition";
import Reader from "./Reader";
import SerializeError from "../model/SerializeError";
import ObjectMetadata from "../metadata/ObjectMetadata";
import Serialize from "../core/Serialize";
import {PrototypeListDefinition} from "../core/TypesDefinition";


const serializableReader: Reader<any> = function(json: JsValue, prototype: Object, genericTypes: PrototypeListDefinition, classPath: string[], failFast: boolean) {

    if(json && ObjectMetadata.hasObjectMetadata(prototype)) {

        let obj = new (prototype.constructor as any)();

        console.log('serializableReader');
        console.log(prototype);
        console.log(ObjectMetadata.getObjectMetadata(prototype));

        const readsPromises = ObjectMetadata.getObjectMetadata(prototype).map(propMetadata => {

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
        return Promise.reject(SerializeError.undefinedReaderError([prototype, genericTypes], classPath))
    }
};

export default serializableReader;