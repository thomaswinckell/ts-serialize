import {JsObject, JsValue} from "ts-json-definition";
import PropTypes from "../core/PropTypes";


/**
 * Transform a class property into a json property
 *
 * @value The value of the class property to write
 * @types The types that the value is supposed to have (useful for generic writers)
 * @parentClass The parent of the class value to write (useful for corner cases)
 * @parentJson The parent of the produced json value (useful for corner cases)
 */
type Writer<T> = (value: T, types: PropTypes, parentClass ?: any, parentJson ?: JsObject) => Promise<JsValue>;

export default Writer;