/**
 * Checks if value is a string
 * @internal
 */
export function isString(v: any): v is string {
  return typeof v === 'string'
}
/**
 * Checks if value is a number
 * @internal
 */
export function isNumber(v: any): v is number {
  return typeof v === 'number'
}
/**
 * Checks if value is a function
 * @internal
 */
export function isFunction(v: any): v is (...args: any[]) => any {
  return typeof v === 'function'
}
/**
 * Checks if value is an array
 * @internal
 */
export function isArray(v: any): v is [] {
  return Array.isArray(v)
}
/**
 * Checks if value is an object
 * @internal
 */
export function isObject(v: any): v is object {
  return v != null && typeof v === 'object' && !isArray(v)
}
/**
 * Calls a function if it is not null
 * @internal
 */
export function call(cb: (...args: any[]) => void, ...args: any[]) {
  return isFunction(cb) ? cb(...args) : null
}
/**
 * Calls the callback of object is not null
 * @internal
 */
export function use<T, R>(obj: T | null, cb: (it: T) => R): R | null {
  return obj == null ? null : cb(obj)
}

/**
 * Clamps a number value
 * @internal
 */
export function clamp(v: number, min: number, max: number) {
  return v < min ? min : v > max ? max : v
}

/**
 * Pads a string
 * @internal
 */
export function padLeft(value: string, length: number, char: string) {
  while (value.length < length) {
    value = `${char}${value}`
  }
  return value
}

export function controllCssClass(name: string) {
  return 'tweakui-control tweakui-control-' + name
}
