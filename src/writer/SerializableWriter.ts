import Writer from "./Writer";
import Serialize from "../core/Serialize";
import SerializeError from "../model/SerializeError";
import {PrototypeListDefinition} from "../core/TypesDefinition";
import MetadataHelper from "../metadata/MetadataHelper";



const serializableWriter: Writer<any> = function(obj: any, prototype: Object, genericTypes: PrototypeListDefinition, givenClassPath: string[], failFast: boolean) {

    if(MetadataHelper.hasMetadata(prototype)) {

        let json = {};
        const classPath = givenClassPath.length === 0 ? [obj.constructor.name] : givenClassPath;

        const metadata = MetadataHelper.getMetadata(prototype);

        const writesPromises = Object.keys(metadata).map(propName => {

            const propMetadata = metadata[propName];

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