/**
 * TODO
 *
 * A type cannot reference itself.
 *
 * @See https://github.com/Microsoft/TypeScript/issues/3496
 */

type JsNotArrayValue = null|string|number|boolean|JsObject;

export type JsArray = Array< JsNotArrayValue >;
export type JsArray2 = Array< JsArray >;
export type JsArray3 = Array< JsArray >;
export type JsArray4 = Array< JsArray >;
export type JsArray5 = Array< JsArray >;
export type JsArray6 = Array< JsArray >;
export type JsArray7 = Array< JsArray >;
export type JsArray8 = Array< JsArray >;
export type JsArray9 = Array< JsArray >;
export type JsArray10 = Array< JsArray >;
// TODO etc...

export type JsValue = JsNotArrayValue|JsArray|JsArray2|JsArray3|JsArray4|JsArray5|JsArray6|JsArray7|JsArray8|JsArray9|JsArray10;

export type JsObject = {
    [ key : string ] : JsValue
};

export type Json = JsArray|JsObject;
