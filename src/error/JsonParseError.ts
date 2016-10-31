import IError from './IError';

export default class JsonParseError implements IError {

    constructor(
        public value : string
    ) {}

    public print() : void {
        console.error( `Error while parsing string into json : ${this.value}` )
    }
}
