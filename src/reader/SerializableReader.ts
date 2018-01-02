import {JsValue} from "ts-json-definition";
import Reader from "./Reader";
import SerializeError from "../core/SerializeError";
import {TypeListDefinition} from "../core/TypesDefinition";
import MetadataHelper from "../metadata/MetadataHelper";
import SerializeHelper from "../core/SerializeHelper";


const serializableReader: Reader<any> = function(json: JsValue, prototype: Object, genericTypes: TypeListDefinition, classPath: string[], typePath: TypeListDefinition, failFast: boolean) {

    if(json && MetadataHelper.hasMetadata(prototype)) {

        let obj = new (prototype.constructor as any)();

        const metadata = MetadataHelper.getMetadata(prototype);

        const readsPromises = Object.keys(metadata).map(propName => {

            const propMetadata = metadata[propName];

            return new Promise((resolve, reject) => {

                const newClassPath = classPath.length === 0 ?
                    [(prototype.constructor as any).name, `.${propMetadata.propName}`] :
                    [...classPath, `.${propMetadata.propName}`];

                    SerializeHelper.readsFromMetadata(propMetadata, json[propMetadata.jsonName || propMetadata.propName], failFast, newClassPath, typePath)
                        .then(value => resolve({value, propMetadata}))
                        .catch(reject)
                })
            });

        return new Promise((resolve, reject) => {

                SerializeHelper.promiseAll(readsPromises, failFast).then((readsResults: any[]) => {

                readsResults.forEach(res => {
                    obj[res.propMetadata.propName] = res.value;
                });

                resolve(obj);

            }).catch(reject);
        });

    } else {
        return Promise.reject(SerializeError.undefinedReaderError([...typePath, prototype, genericTypes], classPath))
    }
};

export default serializableReader;