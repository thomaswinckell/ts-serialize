import {JsValue} from "ts-json-definition"
import {Optional, None} from "scalts"



export default class UnmarshallError implements Error {

    public message : string;
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
    ) {
        const strJsonPath = jsonPath.concat(jsonPropertyName).join('.');
        const strClassPath = classPath.concat(classPropertyName).join('.');
        const baseMessage = `An error occured while serializing value '${strJsonPath}.${value}' into property [${target.constructor['name']}].${strClassPath} : ${type.fold(() => 'UnknownType', t => t['name'])}`;
        this.message = `${baseMessage}\n${additionalMessage.getOrElse(() => '')}`;
    }
}