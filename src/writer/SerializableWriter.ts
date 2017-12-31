import Writer from "./Writer";
import SerializeError from "../core/SerializeError";
import {PrototypeListDefinition} from "../core/TypesDefinition";
import MetadataHelper from "../metadata/MetadataHelper";
import SerializeHelper from "../core/SerializeHelper";



const serializableWriter: Writer<any> = function(obj: any, prototype: Object, genericTypes: PrototypeListDefinition, givenClassPath: string[], failFast: boolean) {

    if(MetadataHelper.hasMetadata(prototype)) {

        let json = {};
        const classPath = givenClassPath.length === 0 ? [obj.constructor.name] : givenClassPath;

        const metadata = MetadataHelper.getMetadata(prototype);

        const writesPromises = Object.keys(metadata).map(propName => {

            const propMetadata = metadata[propName];

            return new Promise((resolve, reject) => {

                const newClassPath = [...classPath, `.${propMetadata.propName}`];

                SerializeHelper.writesFromMetadata(propMetadata, obj[propMetadata.propName], newClassPath, failFast)
                    .then(value => resolve({value, propMetadata}))
                    .catch(reject)
            })
        });

        return new Promise((resolve, reject) => {

            SerializeHelper.promiseAll(writesPromises, failFast).then((writesResults: any[]) => {

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