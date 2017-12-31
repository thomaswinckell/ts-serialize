import Writer from "../writer/Writer";
import Reader from "../reader/Reader";
import {PrototypeListDefinition} from "../core/TypesDefinition";


export class PropMetadata<T> {

    constructor(
        public readonly jsonName : string,
        public readonly propName : string,
        public readonly types : PrototypeListDefinition,
        public readonly writer ?: Writer<T>,
        public readonly reader ?: Reader<T>,
    ) {}
}

type ObjectMetadata = {
    [key: string] : PropMetadata<any>
}


export default ObjectMetadata;