
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
 * Describes a HSL color value
 * @public
 */
export interface HSL {
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
  l: number
}

/**
 * Describes a HSL color value with alpha
 * @public
 */
export interface HSLA extends HSL {
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
 * An implementation to parse and format specific color format
 * @public
 */
export interface ColorFormatter<T> {
  /**
   * Parses a color value and returns an RGBA object with all components normalized to [0:1]
   */
  parse: (v: T) => RGBA
  /**
   * Formats an RGBA color value into a target color format
   */
  format: (rgba: RGBA) => T
}
