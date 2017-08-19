import 'reflect-metadata'
import {JsObject, JsArray, JsValue} from "ts-json-definition"
import ObjectMetadata from "../metadata/ObjectMetadata";

abstract class Serializable {

    static fromString<T>(str: string): Promise<T> {
        try {
            const json = JSON.parse(str);
            return this.fromJsObject<T>(json);
        } catch (e) {
            return Promise.reject(e);
        }
    }

    static fromStringAsArray<T>(str: string): Promise<Array<T>> {
        try {
            const json = JSON.parse(str);
            return this.fromJsArray<T>(json);
        } catch (e) {
            return Promise.reject(e);
        }
    }

    static fromJsObject<T>(jsObject: JsObject, jsonPath: string[] = [], classPath: string[] = []): Promise<T> {
        let obj = new (this.prototype.constructor as any)();

        const readsPromises = ObjectMetadata.getObjectMetadata(this.prototype).map(propMetadata => {

            return new Promise((resolve, reject) => {

                if(!propMetadata.reader) {
                    return reject(`Cannot find reader for property ${propMetadata.className} of class ${this.prototype.constructor} (type : ${propMetadata.types.map(t => t.toString()).join()})`)
                }
                propMetadata.reader(jsObject[propMetadata.jsonName], propMetadata.types, jsObject, obj).then(value => {
                    resolve({
                        value,
                        propMetadata
                    });
                }).catch(reject);
            });
        });

        return new Promise((resolve, reject) => {

            Promise.all(readsPromises).then((readsResults : any[]) => {

                readsResults.forEach(res => {
                    obj[res.propMetadata.className] = res.value;
                });

                resolve(obj);

            }).catch((readsErrors : any[]) => reject(readsErrors));
        });
    }

    static fromJsArray<T>(jsArray: JsArray, jsonPath: string[] = [], classPath: string[] = []): Promise<T[]> {

        const readsPromises = jsArray.map((jsObject: JsObject, index: number) => {

            const newJsonPath = [...jsonPath, `[${index}]`];
            const newClassPath = [...classPath, `[${index}]`];

            return this.fromJsObject<T>(jsObject, newJsonPath, newClassPath);
        });

        return new Promise((resolve, reject) => {

            Promise.all(readsPromises)
                .then(readsResults => resolve(readsResults))
                .catch((readsErrors : any[]) => reject(readsErrors));
        });
    }

    toJson(): Promise<JsObject> {
        let obj = {};

        const writesPromises = ObjectMetadata.getObjectMetadata(this.constructor.prototype).map(propMetadata => {

            return new Promise((resolve, reject) => {
                if(!propMetadata.writer) {
                    return reject(`Cannot find writer for property ${propMetadata.className} of class ${this.constructor.prototype} (type : ${propMetadata.types.map(t => t.toString()).join()})`)
                }
                propMetadata.writer(this[propMetadata.className], propMetadata.types, this, obj).then(value => {
                    resolve({
                        value,
                        propMetadata
                    });
                }).catch(reject);
            })
        });

        return new Promise((resolve, reject) => {

            Promise.all(writesPromises).then((writesResults : any[]) => {

                writesResults.forEach(res => {
                    obj[res.propMetadata.jsonName] = res.value;
                });

                resolve(obj);

            }).catch((writesErrors : any[]) => reject(writesErrors));
        });
    }
}

export default Serializable;
