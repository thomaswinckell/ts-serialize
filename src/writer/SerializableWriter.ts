import Writer from "./Writer";
import Serialize from "../core/Serialize";
import ObjectMetadata from "../metadata/ObjectMetadata";
import SerializeError from "../model/SerializeError";
import {PrototypeListDefinition} from "../core/TypesDefinition";



const serializableWriter: Writer<any> = function(obj: any, prototype: Object, genericTypes: PrototypeListDefinition, givenClassPath: string[], failFast: boolean) {

    if(ObjectMetadata.hasObjectMetadata(prototype)) {

        let json = {};
        const classPath = givenClassPath.length === 0 ? [obj.constructor.name] : givenClassPath;

        const writesPromises = ObjectMetadata.getObjectMetadata(prototype).map(propMetadata => {

            return new Promise((resolve, reject) => {

                const newClassPath = [...classPath, `.${propMetadata.propName}`];

                Serialize.writesFromMetadata(propMetadata, obj[propMetadata.propName], newClassPath, failFast)
                    .then(value => resolve({value, propMetadata}))
                    .catch(reject)
            })
        });

        return new Promise((resolve, reject) => {

            Serialize.promiseAll(writesPromises, failFast).then((writesResults: any[]) => {

                writesResults.forEach(res => {
                    json[res.propMetadata.jsonName] = res.value;
                });

                resolve(json);

            }).catch(reject);
        });
    } else {
        return Promise.reject(SerializeError.undefinedWriterError([prototype, genericTypes], givenClassPath))
    }
};

export default serializableWriter;