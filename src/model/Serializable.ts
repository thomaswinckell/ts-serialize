import 'reflect-metadata'
import {JsObject, JsArray} from "ts-json-definition"
import ObjectMetadata from "../metadata/ObjectMetadata";
import SerializeError from "./SerializeError";


/**
 * Same as Promise.all but retrieve all errors if failFast activated
 *
 * /!\ Use only here ! We know that there will be only instances of Error that will be rejected here.
 * @see formatErrorMessage
 */
function promiseAll<T>(promises : Promise<T>[], failFast : boolean) : Promise<T[]> {

    if(failFast) {
        return Promise.all(promises);

    } else {

        return new Promise<T[]>((resolve, reject) => {

            const caughtPromises = promises.map(p => p.catch(e => e));

            Promise.all(caughtPromises).then((resOrErrors : (T|Error)[]) => {

                const errors = resOrErrors.filter(r => r instanceof Error);
                const results = resOrErrors.filter(r => !(r instanceof Error));

                if(errors.length === 0) {
                    resolve(results as T[]);
                } else {
                    reject(resOrErrors);
                }
            });
        });
    }
}





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

    static fromJsObject<T>(jsObject: JsObject, failFast : boolean = true, jsonPath: string[] = [], classPath: string[] = []): Promise<T> {
        let obj = new (this.prototype.constructor as any)();

        const readsPromises = ObjectMetadata.getObjectMetadata(this.prototype).map(propMetadata => {

            return new Promise((resolve, reject) => {

                if(!propMetadata.reader) {
                    return reject(SerializeError.undefinedReaderError(this.prototype.constructor.name, propMetadata))
                }

                propMetadata.reader(jsObject[propMetadata.jsonName], propMetadata.types, jsObject, obj).then(value => {
                    resolve({
                        value,
                        propMetadata
                    });
                }).catch(e => {
                    const error = SerializeError.readerError(this.prototype.constructor.name, propMetadata, e, jsonPath, classPath);
                    reject(error)
                });
            });
        });

        return new Promise((resolve, reject) => {

            promiseAll(readsPromises, failFast).then((readsResults : any[]) => {

                readsResults.forEach(res => {
                    obj[res.propMetadata.propName] = res.value;
                });

                resolve(obj);

            }).catch(reject);
        });
    }

    static fromJsArray<T>(jsArray: JsArray, failFast : boolean = true, jsonPath: string[] = [], classPath: string[] = []): Promise<T[]> {

        const readsPromises = jsArray.map((jsObject: JsObject, index: number) => {

            const newJsonPath = [...jsonPath, `[${index}]`];
            const newClassPath = [...classPath, `[${index}]`];

            return this.fromJsObject<T>(jsObject, failFast, newJsonPath, newClassPath);
        });

        return new Promise((resolve, reject) => {
            promiseAll(readsPromises, failFast).then(resolve).catch(reject);
        });
    }

    toJson(failFast : boolean = true, jsonPath: string[] = [], classPath: string[] = []): Promise<JsObject> {
        let obj = {};

        const writesPromises = ObjectMetadata.getObjectMetadata(this.constructor.prototype).map(propMetadata => {

            return new Promise((resolve, reject) => {
                if(!propMetadata.writer) {
                    return reject(SerializeError.undefinedWriterError(this.constructor.name, propMetadata))
                }
                propMetadata.writer(this[propMetadata.propName], propMetadata.types, this, obj).then(value => {
                    resolve({
                        value,
                        propMetadata
                    });
                }).catch(e => {
                    const error = SerializeError.writerError(this.constructor.name, propMetadata, e, jsonPath, classPath);
                    reject(error);
                });
            })
        });

        return new Promise((resolve, reject) => {

            promiseAll(writesPromises, failFast).then((writesResults : any[]) => {

                writesResults.forEach(res => {
                    obj[res.propMetadata.jsonName] = res.value;
                });

                resolve(obj);

            }).catch(reject);
        });
    }
}

export default Serializable;
