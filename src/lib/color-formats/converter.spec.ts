import { hsv2rgb, rgb2hsv } from './converter'
import { RGB } from './types'

describe('converter', () => {

  describe('rgb -> hsv -> rgb', () => {
    function testConversion(rgb: RGB) {

      const hsv = rgb2hsv({
        r: rgb.r / 255,
        g: rgb.g / 255,
        b: rgb.b / 255,
      })
      const result = hsv2rgb(hsv)
      const rgb2 = {
        r: Math.round(result.r * 255),
        g: Math.round(result.g * 255),
        b: Math.round(result.b * 255),
      }
      expect(rgb2).toEqual(rgb)
    }

    it('converts (r, g, 0)', () => {
      for (let r = 0; r < 256; r += 1) {
        for (let g = 0; g < 256; g += 1) {
          testConversion({ r: r, g: g, b: 0 })
        }
      }
    })

    it('converts (r, g, 255)', () => {
      for (let r = 0; r < 256; r += 1) {
        for (let g = 0; g < 256; g += 1) {
          testConversion({ r: r, g: g, b: 255 })
        }
      }
    })

    it('converts (r, 0, b)', () => {
      for (let r = 0; r < 256; r += 1) {
        for (let b = 0; b < 256; b += 1) {
          testConversion({ r: r, g: 0, b: b })
        }
      }
    })

    it('converts (r, 255, b)', () => {
      for (let r = 0; r < 256; r += 1) {
        for (let b = 0; b < 256; b += 1) {
          testConversion({ r: r, g: 255, b: b })
        }
      }
    })

    it('converts (0, g, b)', () => {
      for (let g = 0; g < 256; g += 1) {
        for (let b = 0; b < 256; b += 1) {
          testConversion({ r: 0, g: g, b: b })
        }
      }
    })

    it('converts (255, g, b)', () => {
      for (let g = 0; g < 256; g += 1) {
        for (let b = 0; b < 256; b += 1) {
          testConversion({ r: 255, g: g, b: b })
        }
      }
    })
  })
})
