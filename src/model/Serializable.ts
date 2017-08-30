import 'reflect-metadata'
import {JsObject, JsArray, Json, JsValue} from "ts-json-definition"
import ObjectMetadata from "../metadata/ObjectMetadata";
import SerializeHelper from "../core/SerializeHelper";





/**
 * All class with properties using Serialize decorator should extends Serializable.
 */
abstract class Serializable {

    static fromString<T>(str: string, failFast : boolean = true): Promise<T> {
        try {
            const json = JSON.parse(str);
            return this.fromJsObject<T>(json, failFast);
        } catch (e) {
            return Promise.reject(e);
        }
    }

    static fromStringAsArray<T>(str: string, failFast : boolean = true): Promise<Array<T>> {
        try {
            const json = JSON.parse(str);
            return this.fromJsArray<T>(json, failFast);
        } catch (e) {
            return Promise.reject(e);
        }
    }

    static fromJson<T>(json: Json, failFast : boolean = true, classPath: string[] = []): Promise<T> {
        if(Array.isArray(json)) {
            return this.fromJsArray(json, failFast, classPath) as any
        } else if(typeof json === 'object') {
            return this.fromJsObject<T>(json as JsObject, failFast, classPath)
        } else {
            return Promise.reject(`Bad usage of Serializable.fromJson function : json parameter should be an array or an object.`)
        }
    }

    static fromJsObject<T>(jsObject: JsObject, failFast : boolean = true, classPath: string[] = [this.prototype.constructor.name]): Promise<T> {
        let obj = new (this.prototype.constructor as any)();

        const readsPromises = ObjectMetadata.getObjectMetadata(this.prototype).map(propMetadata => {

            return new Promise((resolve, reject) => {

                const newClassPath = [...classPath, `.${propMetadata.propName}` ];

                SerializeHelper.readsFromMetadata(propMetadata, jsObject[propMetadata.jsonName], newClassPath, failFast)
                    .then(value => resolve({ value, propMetadata }))
                    .catch(reject)
            })
        });

        return new Promise((resolve, reject) => {

            SerializeHelper.promiseAll(readsPromises, failFast).then((readsResults : any[]) => {

                readsResults.forEach(res => {
                    obj[res.propMetadata.propName] = res.value;
                });

                resolve(obj);

            }).catch(reject);
        });
    }

    static fromJsArray<T>(jsArray: JsArray, failFast : boolean = true, classPath: string[] = []): Promise<T[]> {

        const readsPromises = jsArray.map((jsObject: JsObject, index: number) => {

            const newClassPath = [...classPath, `[${index}]`];

            return this.fromJsObject<T>(jsObject, failFast, newClassPath);
        });

        return SerializeHelper.promiseAll(readsPromises, failFast);
    }

    toJson(failFast : boolean = true, classPath: string[] = [this.constructor.name]): Promise<JsObject> {
        let obj = {};

        const writesPromises = ObjectMetadata.getObjectMetadata(this.constructor.prototype).map(propMetadata => {


            return new Promise((resolve, reject) => {

                const newClassPath = [...classPath, `.${propMetadata.propName}` ];

                SerializeHelper.writesFromMetadata(propMetadata, this[propMetadata.propName], newClassPath, failFast)
                    .then(value => resolve({ value, propMetadata }))
                    .catch(reject)
            })
        });

        return new Promise((resolve, reject) => {

            SerializeHelper.promiseAll(writesPromises, failFast).then((writesResults : any[]) => {

                writesResults.forEach(res => {
                    obj[res.propMetadata.jsonName] = res.value;
                });

                resolve(obj);

            }).catch(reject);
        });
    }
}

export default Serializable;
