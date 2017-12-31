import Writer from "../writer/Writer";
import Reader from "../reader/Reader";
import {PrototypeListDefinition} from "../core/TypesDefinition";


export interface PropMetadata<T> {
    types : PrototypeListDefinition;
    propName : string;
    jsonName ?: string;
    writer ?: Writer<T>;
    reader ?: Reader<T>;
}

type ObjectMetadata = {
    [key: string] : PropMetadata<any>
}

export type PartialObjectMetadata = Partial<{
    [key: string] : Partial<PropMetadata<any>>
}>

export default ObjectMetadata;