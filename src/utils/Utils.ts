export function isObject(v: any) : v is Object {
    return v && v instanceof Object && v.constructor === Object;
}

// Cannot use Array.isArray, because Array.isArray(Array.prototype) === true
export function isArray(v: any) {
    return Array.isArray(v)
}