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
 * @public
 */
export function call(cb: (...args: any[]) => void, ...args: any[]) {
  return isFunction(cb) ? cb(...args) : null
}
/**
 * Calls the callback of object is not null
 * @public
 */
export function use<T, R>(obj: T | null, cb: (it: T) => R): R | null {
  return obj == null ? null : cb(obj)
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

export function controllCssClass(name: string) {
  return 'tweakui-control tweakui-control-' + name
}

/**
 * Describes a HSV color value
 * @public
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
 * @public
 */
export interface HSVA extends HSV {
  /**
   * The alpha component
   */
  a: number
}

/**
 * Describes an RGB color value
 * @public
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
 * @public
 */
export interface RGBA extends RGB {
  /**
   * The alpha component
   */
  a: number
}

/**
 * Converts hsv to rgb
 * @public
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
 * @public
 */
export function rgb2hsv(rgb: RGB): HSV {

  let r = rgb.r / 255
  let g = rgb.g / 255
  let b = rgb.b / 255

  let V = Math.max(r, g, b)
  let d = V - Math.min(r, g, b)

  let S = 0
  let H = 0
  if (d !== 0)  {
    S = d / V
    if (V === r) {
      H = (g - b) / d + (g < b ? 6 : 0)
      H = (H % 6) * 60
    } else if (V === g) {
      H = (b - r) / d + 2
      H = H * 60
    } else {
      H = (r - g) / d + 4
      H = H * 60
    }
  }

  return { h: H, s: S, v: V }
}

/**
 * Converts rgb to hex string with a leading `#`
 * @public
 * @param rgb
 */
export function rgb2hex(rgb: RGB) {
  return '#' + [rgb.r, rgb.g, rgb.b].map((it) => padLeft(it.toString(16), 2, '0') ).join('')
}

/**
 * Converts rgb to hex string with a leading `#`
 * @public
 * @param rgba
 */
export function rgba2hex(rgba: RGBA) {
  return '#' + [rgba.r, rgba.g, rgba.b, Math.floor(rgba.a * 255)].map((it) => padLeft(it.toString(16), 2, '0') ).join('')
}

/**
 *
 * @public
 * @param rgb
 * @param alpha
 */
export function rgba2css(rgb: RGB, alpha: number = 1) {
  return ['rgba(', rgb.r, ',', rgb.g, ',', rgb.b, ',', alpha, ')'].join('')
}

/**
 *
 * @public
 * @param rgba
 * @param format
 */
export function formatColor(rgba: RGBA, format: string) {
  const fmt = describeFormat(format)

  if (fmt.normalized && (fmt.isArray || fmt.isObject)) {
    rgba.r = rgba.r / 255
    rgba.g = rgba.g / 255
    rgba.b = rgba.b / 255
  } else {
    rgba.a = Math.floor(rgba.a * 255)
  }

  if (fmt.isArray) {
    return fmt.components.map((key) => rgba[key])
  }
  if (fmt.isObject) {
    return rgba
  }
  if (fmt.isNumber) {
    // tslint:disable-next-line:no-bitwise
    const val = fmt.components.map((key) => padLeft((rgba[key] || 0).toString(16), 2, '0')).join('')
    return parseInt('0x' + val, 16)
  }
  return '#' + fmt.components.map((key) => padLeft(rgba[key].toString(16), 2, '0')).join('')
}

function describeFormat(format: string = 'rgb') {
  return {
    components: (format.match(/[rgba]+/)[0] || '').split(''),
    normalized: /(\[n\])|\{n\}/.test(format),
    isArray: /(\[n?\])/.test(format),
    isObject: /(\{n?\})/.test(format),
    isNumber: /0x/.test(format),
  }
}

/**
 *
 * @public
 * @param value
 * @param format
 */
export function parseColor(value: string | number | number[], format: string) {
  const rgba: RGBA = {
    r: 0,
    g: 0,
    b: 0,
    a: 1,
  }

  const fmt = describeFormat(format)
  if (Array.isArray(value) && fmt.isArray) {
    fmt.components.forEach((key, i) => {
      rgba[key] = value[i] || 0
    })
  } else if (isObject(value) && fmt.isObject) {
    fmt.components.forEach((key) => {
      rgba[key] = (value as any)[key] || 0
    })
  } else if (isNumber(value) && fmt.isNumber) {
    fmt.components.reverse().forEach((key, i) => {
      // tslint:disable-next-line:no-bitwise
      rgba[key] = (value >> (i * 8)) & 255
    })
  } else if (isString(value) && /[0-9a-f]+/i.test(value)) {
    let v: string = value.match(/[0-9a-f]+/i)[0]
    if (v.length === fmt.components.length) {
      v = v.split('').map((it) => `${it}${it}`).join('')
    }
    if (v.length === fmt.components.length * 2) {
      fmt.components.forEach((key, i) => {
        rgba[key] = parseInt(v.substr(i * 2, 2), 16)
      })
    } else {
      console.warn('unable to parse color value', value)
    }
  } else {
    //
  }

  if (fmt.normalized && (fmt.isArray || fmt.isObject)) {
    // all inputs are normalized in range [0:1]
    // convert back to [0:255]
    rgba.r = Math.floor(rgba.r * 255)
    rgba.g = Math.floor(rgba.g * 255)
    rgba.b = Math.floor(rgba.b * 255)
    // keep alpha in range [0:1]
  } else {
    // all inputs are in range [0:255]
    // no need for conversion for rgb value
    // but alpha must be converted to [0:1]
    rgba.a = rgba.a / 255
  }

  return rgba
}

export default {
  hsv2rgb,
  rgb2hsv,
  rgb2hex,
  rgba2hex,
  rgba2css,
  formatColor,
  parseColor,
}
