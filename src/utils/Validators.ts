export function isPlainObject(v: any) : v is Object {
    return v && v instanceof Object && v.constructor === Object;
}

export function isObject(v: any) : v is Object {
    return v && v instanceof Object;
}

export function isArray(v: any) : v is any[] {
    return Array.isArray(v);
}

export function isBoolean(v: any) : v is boolean {
    return typeof v === 'boolean';
}

export function isNumber(v: any) : v is number {
    return typeof v === 'number';
}

export function isString(v: any) : v is string {
    return typeof v === 'string';
}

export function isMap<K, V>(v: any) : v is Map<K, V> {
    return v instanceof Map;
}