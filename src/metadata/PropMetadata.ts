import Writer from "../writer/Writer";
import Reader from "../reader/Reader";
import PropTypes from "../core/PropTypes";


export default class PropMetadata<T> {

    constructor(
        public jsonName : string,
        public propName : string,
        public types : PropTypes,
        public writer ?: Writer<T>,
        public reader ?: Reader<T>,
    ) {}
}