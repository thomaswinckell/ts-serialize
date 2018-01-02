import Writer from "./Writer";
import SerializeError from "../core/SerializeError";
import {TypeListDefinition} from "../core/TypesDefinition";
import MetadataHelper from "../metadata/MetadataHelper";
import SerializeHelper from "../core/SerializeHelper";



const serializableWriter: Writer<any> = function(obj: any, prototype: Object, genericTypes: TypeListDefinition, classPath: string[], typePath: TypeListDefinition, failFast: boolean) {

    if(MetadataHelper.hasMetadata(prototype)) {

        let json = {};

        const metadata = MetadataHelper.getMetadata(prototype);

        const writesPromises = Object.keys(metadata).map(propName => {

            const propMetadata = metadata[propName];

            return new Promise((resolve, reject) => {

                const newClassPath = classPath.length === 0 ?
                    [(prototype.constructor as any).name, `.${propMetadata.propName}`] :
                    [...classPath, `.${propMetadata.propName}`];

                SerializeHelper.writesFromMetadata(propMetadata, obj[propMetadata.propName], failFast, newClassPath, [])
                    .then(value => resolve({value, propMetadata}))
                    .catch(reject)
            })
        });

        return new Promise((resolve, reject) => {

            SerializeHelper.promiseAll(writesPromises, failFast).then((writesResults: any[]) => {

                writesResults.forEach(res => {
                    json[res.propMetadata.jsonName || res.propMetadata.propName] = res.value;
                });

                resolve(json);

            }).catch(reject);
        });
    } else {
        return Promise.reject(SerializeError.undefinedWriterError([...typePath, prototype, genericTypes], classPath))
    }
};

export default serializableWriter;