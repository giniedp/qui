import { clamp } from '../utils'
import { HSV, RGB } from './types'

/**
 * Converts hsv to rgb
 *
 * @public
 * @param hsv - HSV components where H is in range [0:360] and S and V are in range [0:1]
 * @returns RGB color components in range [0:1]
 */
export function hsv2rgb(hsv: HSV): RGB {
  let H = (hsv.h % 360)
  let S = clamp(hsv.s, 0, 1)
  let V = clamp(hsv.v, 0, 1)

  let C = V * S
  let X = C * (1 - Math.abs((H / 60) % 2 - 1))
  let m = V - C

  const rgb: RGB = { r: 0, g: 0, b: 0 }
  if (H < 60) {
    rgb.r = C
    rgb.g = X
    rgb.b = 0
  } else if (H < 120) {
    rgb.r = X
    rgb.g = C
    rgb.b = 0
  } else if (H < 180) {
    rgb.r = 0
    rgb.g = C
    rgb.b = X
  } else if (H < 240) {
    rgb.r = 0
    rgb.g = X
    rgb.b = C
  } else if (H < 300) {
    rgb.r = X
    rgb.g = 0
    rgb.b = C
  } else {
    rgb.r = C
    rgb.g = 0
    rgb.b = X
  }

  rgb.r += m
  rgb.g += m
  rgb.b += m

  return rgb
}

/**
 * Converts rgb to hsv
 *
 * @public
 * @remarks
 * The RGB components are assumed to be in range [0:1].
 * The resulting H component is in range [0:360] and S and V in range [0:1]
 */
export function rgb2hsv(rgb: RGB): HSV {

  let r = rgb.r
  let g = rgb.g
  let b = rgb.b

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
