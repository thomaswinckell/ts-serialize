import 'reflect-metadata'
import {JsObject, JsArray, Json} from "ts-json-definition"
import ObjectMetadata from "../metadata/ObjectMetadata";


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

    static fromJson<T>(json: Json, failFast : boolean = true, classPath: string[] = []): Promise<T> {
        if(Array.isArray(json)) {
            return this.fromJsArray(json, failFast, classPath) as any
        } else if(typeof json === 'object') {
            return this.fromJsObject<T>(json as JsObject, failFast, classPath)
        } else {
            return Promise.reject(`Bad usage of Serializable.fromJson function : json parameter should be an array or an object.`)
        }
    }

    static fromJsObject<T>(jsObject: JsObject, failFast : boolean = true, classPath: string[] = []): Promise<T> {
        let obj = new (this.prototype.constructor as any)();

        const readsPromises = ObjectMetadata.getObjectMetadata(this.prototype).map(propMetadata => {

            return propMetadata.reads(this.prototype.constructor.name, jsObject, obj, failFast, classPath,)
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

    static fromJsArray<T>(jsArray: JsArray, failFast : boolean = true, classPath: string[] = []): Promise<T[]> {

        const readsPromises = jsArray.map((jsObject: JsObject, index: number) => {

            const newClassPath = [...classPath, `[${index}]`];

            return this.fromJsObject<T>(jsObject, failFast, newClassPath);
        });

        return new Promise((resolve, reject) => {
            promiseAll(readsPromises, failFast).then(resolve).catch(reject);
        });
    }

    toJson(failFast : boolean = true, classPath: string[] = []): Promise<JsObject> {
        let obj = {};

        const writesPromises = ObjectMetadata.getObjectMetadata(this.constructor.prototype).map(propMetadata => {

            return propMetadata.writes(this.constructor.name, this, obj, failFast, classPath);
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
