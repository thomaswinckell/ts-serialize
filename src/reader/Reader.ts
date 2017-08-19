import {Json, JsValue} from "ts-json-definition";
import PropTypes from "../core/PropTypes";


/**
 * Validate and transform a json property into a typed class property
 *
 * @value The value of the json property to read
 * @types The types that the value is supposed to have (useful for generic readers)
 * @parentJson The parent of the json value to read (useful for corner cases)
 * @parentClass The parent of the produced class value (useful for corner cases)
 */
type Reader<T> = (value: JsValue, types: PropTypes, parentJson ?: Json, parentClass ?: any) => Promise<T>;

export default Reader;