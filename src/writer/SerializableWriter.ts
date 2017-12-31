import Writer from "./Writer";
import {PrototypeListDefinition} from "../core/TypesDefinition";
import ObjectMetadata from "../core/ObjectMetadata";
import SerializeHelper from "../core/SerializeHelper";


export default function(objectMetadata: ObjectMetadata) : Writer<any> {

    return function(obj: any, prototype: Object, genericTypes: PrototypeListDefinition, givenClassPath: string[], failFast: boolean) {

        let json = {};
        const classPath = givenClassPath.length === 0 ? [obj.constructor.name] : givenClassPath;

        const writesPromises = Object.keys(objectMetadata).map(propName => {

            const propMetadata = objectMetadata[propName];

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
    };
}