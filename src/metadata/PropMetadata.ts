import Writer from "../writer/Writer";
import Reader from "../reader/Reader";
import PropTypes from "../core/PropTypes";
import SerializeError from "../model/SerializeError";
import {JsObject, JsValue} from "ts-json-definition";
import Serializable from "../model/Serializable";


export default class PropMetadata<T> {

    constructor(
        public readonly jsonName : string,
        public readonly propName : string,
        public readonly types : PropTypes,
        private readonly writer ?: Writer<T>,
        private readonly reader ?: Reader<T>,
    ) {}

    reads(className: string, jsObject: JsObject, modelObject: any, failFast: boolean, classPath: string[]) : Promise<{ value : T, propMetadata : PropMetadata<T>}> {

        if(this.reader) {

            return new Promise((resolve, reject) => {

                if(this.reader) { // FIXME : WTF Typescript ?!

                    this.reader(jsObject[this.jsonName], this.types, jsObject, modelObject).then(value => {

                        resolve({
                            value,
                            propMetadata: this
                        });

                    }).catch(e => {
                        const error = SerializeError.readerError(className, this, e, classPath);
                        reject(error)
                    });
                }
            });
        }

        if(this.types[0] && Serializable.prototype.isPrototypeOf((this.types[0] as any).prototype)) {

            return new Promise((resolve, reject) => {

                return (this.types[0] as any).fromJsObject(jsObject[this.jsonName], failFast, [...classPath, `.${this.propName}`]).then((value: T) => {
                    resolve({
                        value,
                        propMetadata: this
                    })
                }).catch((err: any) => reject(err))
            });
        }

        return Promise.reject(SerializeError.undefinedReaderError(className, this, classPath))
    }

    writes(className: string, modelObject: any, jsonObject: JsObject, failFast: boolean, classPath: string[]) : Promise<{ value : JsValue, propMetadata : PropMetadata<T>}> {

        if(this.writer) {
            return new Promise((resolve, reject) => {

                if(this.writer) { // FIXME : WTF Typescript ?!

                    this.writer(modelObject[this.propName], this.types, modelObject, jsonObject).then(value => {
                        resolve({
                            value,
                            propMetadata: this
                        });
                    }).catch(e => {
                        const error = SerializeError.writerError(className, this, e, classPath);
                        reject(error);
                    });
                }
            });
        }

        if(modelObject[this.propName] instanceof Serializable) {
            return new Promise((resolve, reject) => {

                return modelObject[this.propName].toJson(failFast, [...classPath, `.${this.propName}`]).then((value: any) => {
                    resolve({
                        value,
                        propMetadata: this
                    })
                }).catch((err: any) => reject(err))
            });
        }

        return Promise.reject(SerializeError.undefinedWriterError(className, this, classPath))
    }
}