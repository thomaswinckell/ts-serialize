import {JsValue} from "ts-json-definition";
import {TypeListDefinition} from "../core/TypesDefinition";


/**
 * Transform a class property into a json property
 *
 * @value The value of the class property to write
 * @genericTypes The generic types of the type that the value is supposed to have (useful for generic writers)
 * @parentClass The parent of the class value to write (useful for corner cases)
 * @parentJson The parent of the produced json value (useful for corner cases)
 */
type Writer<T> = (value: T, prototype: Object, genericTypes: TypeListDefinition, classPath: string[], typePath: TypeListDefinition, failFast: boolean) => Promise<JsValue>;

export default Writer;