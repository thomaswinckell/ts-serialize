import {JsValue} from "ts-json-definition"
import {Optional, None} from "scalts"



export default class UnmarshallError implements Error {

    public name : string = 'UnmarshallError';

    constructor(
        public value : JsValue,
        public type : Optional< Function >,
        public jsonPropertyName : string,
        public classPropertyName : string,
        public target : Function,
        public jsonPath : string[],
        public classPath : string[],
        public additionalMessage : Optional< string > = None
    ) {}

    get message() {
        const strClassPath = `${this.classPath.join('.')}.${this.target.constructor['name']}.${this.classPropertyName}`;
        const baseMessage = `An error occurred while serializing value ${this.value} into property ${strClassPath} of type ${this.type.fold(() => 'unknown', t => t['name'])}.`;
        return `${baseMessage}${this.additionalMessage.map(m => `\n\t${m}`).getOrElse(() => '')}`;
    }

    toString() {
        return this.message;
    }
}