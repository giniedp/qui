import type { ArrayOrSingleOf, ComponentAttrs, ComponentModel } from './types'
import type { Children, Vnode } from 'mithril'

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
  if (v != null) {
    if (min != null && v < min) {
      return min
    }
    if (max != null && v > max) {
      return max
    }
  }
  return v
}
/**
 * Builds a css class from various argument types
 * @param exp
 */
export function cssClass(
  exp: ArrayOrSingleOf<string | { [k: string]: boolean | (() => boolean) }>,
): string {
  if (!exp) {
    return null
  }
  if (isString(exp)) {
    return exp
  }
  if (isArray(exp)) {
    return exp.map(cssClass).join(' ')
  }
  return Object.keys(exp)
    .filter((it) => resolve(exp[it]))
    .filter((it) => isString(it) && !!it)
    .join(' ')
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
export function twuiClass(name: string, variation?: string) {
  return `twui-${name}` + (variation ? `-${variation}` : '')
}

/**
 * Gets current mouse coordinates from mouse or touch event
 * @internal
 */
export function getTouchPoint(e: MouseEvent | TouchEvent): [number, number] {
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

export function getTouchInTarget(e: MouseEvent, target?: HTMLElement, offset?: [number, number]) {
  target = target || e.target as HTMLElement
  const rect = target.getBoundingClientRect()
  const tx = window.pageXOffset || document.documentElement.scrollLeft
  const ty = window.pageYOffset || document.documentElement.scrollTop

  const cw = target.clientWidth
  const ch = target.clientHeight
  let [cx, cy] = getTouchPoint(e)
  if (offset) {
    cx += offset[0]
    cy += offset[1]
  }
  const x = cx - tx - rect.left
  const y = cy - ty - rect.top
  return {
    width: cw,
    height: ch,
    x: x,
    y: y,
    normalizedX: x / cw,
    normalizedY: y / ch,
  }
}

/**
 * @internal
 */
export function viewFn<T extends ComponentModel>(
  fn: (data: T, node: Vnode<ComponentAttrs<T>>) => Children,
) {
  return (node: Vnode<ComponentAttrs<T>>): Children =>
    use(node.attrs.data, (data) => fn(data, node))
}

export function dataFn<T extends ComponentModel, R>(
  node: Vnode<ComponentAttrs<T>>,
  fn: (data: T, node: Vnode<ComponentAttrs<T>>) => R,
) {
  return () => fn(node.attrs.data, node)
}

export function dragUtil({
  onStart,
  onMove,
  onEnd,
}: {
  onStart?: (e: MouseEvent) => void
  onMove?: (e: MouseEvent) => void
  onEnd?: (e: MouseEvent) => void
}) {
  const util = {
    target: null as HTMLElement,
    activate: (e: MouseEvent) => {
      util.deactivate()
      util.target = e.target as HTMLElement
      if (onStart) {
        onStart(e)
      }
      if (onMove) {
        document.addEventListener('mousemove', onMove, { passive: false })
        document.addEventListener('touchmove', onMove, { passive: false })
      }
      if (onEnd) {
        document.addEventListener('mouseup', onEnd)
        document.addEventListener('touchend', onEnd)
        document.addEventListener('touchcancel', onEnd)
      }
    },
    deactivate: () => {
      util.target = null
      if (onMove) {
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('touchmove', onMove)
      }
      if (onEnd) {
        document.removeEventListener('mouseup', onEnd)
        document.removeEventListener('touchend', onEnd)
        document.removeEventListener('touchcancel', onEnd)
      }
    },
    onStart,
    onMove,
    onEnd,
  }
  return util
}
