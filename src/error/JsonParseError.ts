export default class JsonParseError extends Error {

    constructor(public value : string) {
        super(`Error while parsing string into json : ${value}`);
    }
}
