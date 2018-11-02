import m from 'mithril'

const components: { [key: string]: m.FactoryComponent<any> | m.ClassComponent } = {}

/**
 * Common control properties
 */
export interface ControlDef {
  [key: string]: any

  /**
   * The type name of the control
   */
  type: string
  /**
   * Some sort of an id for a control @see https://mithril.js.org/keys.html
   */
  key?: string
  /**
   * If resolves to `true` this control will not be rendered
   */
  hidden?: boolean | (() => boolean)
  /**
   * The label text for this control group
   *
   * @remarks
   * Most elements will render a label tag even if there is no
   * text. If set to `null` the label tag will be omitted.
   */
  label?: string
}

/**
 * Gets a registered component for a given type
 *
 * @param type The component type
 */
export function getComponent(type: string) {
  if (components[type]) {
    return components[type]
  }
  console.error(`no component found for type: ${type}`)
  return null
}

/**
 * Registeres a component
 *
 * @param name The component type name
 * @param comp The component
 */
export function registerComponent(name: string, comp: m.FactoryComponent<any> | m.ClassComponent) {
  if (components[name]) {
    console.warn(`component '${name}' is already registered`)
  } else {
    components[name] = comp
  }
}

/**
 * Checks if value is a string
 */
export function isString(v: any): v is string {
  return typeof v === 'string'
}
/**
 * Checks if value is a number
 */
export function isNumber(v: any): v is number {
  return typeof v === 'number'
}
/**
 * Checks if value is a function
 */
export function isFunction(v: any): v is (...args: any[]) => any {
  return typeof v === 'function'
}
/**
 * Checks if value is an array
 */
export function isArray(v: any): v is [] {
  return Array.isArray(v)
}
/**
 * Calls a function if it is not null
 */
export function call(cb: (...args: any[]) => void, ...args: any[]) {
  return isFunction(cb) ? cb(...args) : null
}
/**
 * Calls the callback of object is not null
 */
export function use<T, R>(obj: T | null, cb: (it: T) => R): R | null {
  return obj == null ? null : cb(obj)
}
/**
 * Renderes a label if the given text is not null
 *
 * @remarks
 * The label will be rendered even if the text is undefined or empty
 */
export function label(l: string) {
  return l === null ? null : m('label', l)
}
/**
 * Clamps a number value
 */
export function clamp(v: number, min: number, max: number) {
  return v < min ? min : v > max ? max : v
}

export function padLeft(value: string, length: number, char: string) {
  while (value.length < length) {
    value = `${char}${value}`
  }
  return value
}

/**
 * Describes a HSV color value
 */
export interface HSV {
  [key: string]: number
  /**
   * The hue component
   */
  h: number
  /**
   * The saturation component
   */
  s: number
  /**
   * The value component
   */
  v: number
}

/**
 * Describes a HSV color value with alpha
 */
export interface HSVA extends HSV {
  /**
   * The alpha component
   */
  a: number
}

/**
 * Describes an RGB color value
 */
export interface RGB {
  [key: string]: number
  /**
   * The red component
   */
  r: number
  /**
   * The green component
   */
  g: number
  /**
   * The blue component
   */
  b: number
}

/**
 * Describes an RGB color value with alpha
 */
export interface RGBA extends RGB {
  /**
   * The alpha component
   */
  a: number
}

/**
 * Converts hsv to rgb
 */
export function hsv2rgb(hsv: HSV): RGB {
  let h = (hsv.h % 360) / 60

  let C = hsv.v * hsv.s
  let X = C * (1 - Math.abs(h % 2 - 1))
  let R = hsv.v - C
  let G = R
  let B = R

  // tslint:disable-next-line:no-bitwise
  h = ~~h
  R += [C, X, 0, 0, X, C][h]
  G += [X, C, C, X, 0, 0][h]
  B += [0, 0, X, C, C, X][h]

  let r = Math.floor(R * 255)
  let g = Math.floor(G * 255)
  let b = Math.floor(B * 255)
  return { r: r, g: g, b: b }
}

/**
 * Converts rgb to hsv
 */
export function rgb2hsv(rgb: RGB): HSV {

  let r = rgb.r
  let g = rgb.g
  let b = rgb.b

  if (rgb.r > 1 || rgb.g > 1 || rgb.b > 1) {
      r /= 255
      g /= 255
      b /= 255
  }

  let V = Math.max(r, g, b)
  let C = V - Math.min(r, g, b)
  let H = (C === 0 ? null :
        V === r ? (g - b) / C + (g < b ? 6 : 0) :
        V === g ? (b - r) / C + 2 :
                (r - g) / C + 4)
  H = (H % 6) * 60
  let S = C === 0 ? 0 : C / V
  return { h: H, s: S, v: V }
}

export function getValue<V, T>(def: { value?: V, target?: T, property?: keyof T }): V {
  return def.target && def.property ? def.target[def.property] as any : def.value
}

export function setValue<V, T>(def: { value?: V, target?: T, property?: keyof T }, value: V) {
  if (def.target && def.property) {
    def.target[def.property] = value as any
  }
  def.value = value
}
