
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

export interface ColorFormatter<T> {
  parse: (v: T) => RGBA
  format: (rgba: RGBA) => T
}
