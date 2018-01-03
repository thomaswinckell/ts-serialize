import Writer from "../writer/Writer";
import Reader from "../reader/Reader";
import {TypeListDefinition} from "../core/TypesDefinition";


export interface PropMetadata<T> {
    types : TypeListDefinition;
    propName : string;
    jsonName ?: string;
    writer ?: Writer;
    reader ?: Reader<T>;
}

type ObjectMetadata = {
    [key: string] : PropMetadata<any>
}

export type PartialObjectMetadata = Partial<{
    [key: string] : Partial<PropMetadata<any>>
}>

export default ObjectMetadata;