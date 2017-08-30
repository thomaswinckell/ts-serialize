import Writer from "../writer/Writer";
import Reader from "../reader/Reader";
import PropTypes from "../core/PropTypes";


export default class PropMetadata<T> {

    constructor(
        public readonly jsonName : string,
        public readonly propName : string,
        public readonly types : PropTypes,
        public readonly writer ?: Writer<T>,
        public readonly reader ?: Reader<T>,
    ) {}
}