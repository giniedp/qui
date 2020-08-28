import { ArrayOrSingleOf, ComponentAttrs, ComponentModel } from './types'
import { Children, Vnode } from 'mithril'

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
export function isArray(v: any): v is any[] {
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
export function call<T extends (...args: any) => any>(cb: T, ...args: Parameters<T>) {

  return isFunction(cb) ? cb(...args) : null
}
/**
 * Resolves a property to its value
 * @param value - the function or value to resolve
 */
export function resolve<T>(value: (() => T) | T) {
  return isFunction(value) ? value() : value
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
 * Builds a css class from various argument types
 * @param exp
 */
export function cssClass(exp: ArrayOrSingleOf<string | { [k: string]: boolean | (() => boolean) }>): string {
  if (!exp) {
    return null
  }
  if (isString(exp)) {
    return exp
  }
  if (isArray(exp)) {
    return exp.map(cssClass).join(' ')
  }
  return Object.keys(exp).filter((it) => resolve(exp[it])).filter((it) => isString(it) && !!it).join(' ')
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

/**
 * @internal
 */
export function ctrlCss(name: string) {
  return 'twui-ctl-' + name
}

/**
 * @internal
 */
export function twuiClass(name: string) {
  return 'twui-' + name
}

/**
 * Gets current mouse coordinates from mouse or touch event
 * @internal
 */
export function getMouseXY(e: MouseEvent | TouchEvent) {
  let cx = 0
  let cy = 0
  if ('touches' in e) {
    cx = e.touches.item(0).pageX
    cy = e.touches.item(0).pageY
  } else {
    cx = e.pageX
    cy = e.pageY
  }
  return [cx, cy]
}

/**
 * @internal
 */
export function viewFn<T extends ComponentModel>(fn: (data: T, node: Vnode<ComponentAttrs<T>>) => Children) {
  return (node: Vnode<ComponentAttrs<T>>): Children => use(node.attrs.data, (data) => fn(data, node))
}

/**
 * @interlnal
 */
export function scrollIntoView(el: HTMLElement) {
  el.scrollIntoView?.({ behavior: 'auto', block: 'start'})
}
