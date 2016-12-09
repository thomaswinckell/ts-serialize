import {JsValue} from "ts-json-definition"
import {Optional, None} from "scalts"
import {Constructor} from "../utils"

import IError from './IError'



export default class UnmarshallError implements IError {

    constructor(
        public value : JsValue,
        public type : Optional< Function >,
        public jsonPropertyName : string,
        public classPropertyName : string,
        public target : Constructor< any >,
        public jsonPath : string[],
        public classPath : string[],
        public additionalMessage : Optional< string > = None
    ) {}

    get baseMessage() : string {
        const jsonPath = this.jsonPath.concat(this.jsonPropertyName).join('.');
        const classPath = this.classPath.concat(this.classPropertyName).join('.');
        return `An error occured while serializing value '${jsonPath}.${this.value}' into property [${this.target.constructor['name']}].${classPath} : ${this.type.fold('UnknownType', t => t['name'])}`;
    }

    print() : void {
        console.error(`${this.baseMessage}\n${this.additionalMessage.getOrElse('')}`);
    }
}