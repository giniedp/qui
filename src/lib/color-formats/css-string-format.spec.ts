import { CssStringFormat } from './css-string-format'

describe('CssStringFormat', () => {

  describe('parse', () => {
    it('rgb', () => {
      expect(new CssStringFormat(['r', 'g', 'b']).parse('rgb(10, 20, 30)')).toEqual({
        r: 10 / 255,
        g: 20 / 255,
        b: 30 / 255,
        a: 1,
      })
    })

    it('rgba', () => {
      expect(new CssStringFormat(['r', 'g', 'b', 'a']).parse('rgba(10, 20, 30, 0.5)')).toEqual({
        r: 10 / 255,
        g: 20 / 255,
        b: 30 / 255,
        a: 0.5,
      })
    })
  })

  describe('format', () => {
    it('rgb', () => {
      expect(new CssStringFormat(['r', 'g', 'b']).format({
        r: 10 / 255,
        g: 20 / 255,
        b: 30 / 255,
        a: 0.5,
      })).toEqual('rgb(10, 20, 30)')
    })

    it('rgba', () => {
      expect(new CssStringFormat(['r', 'g', 'b', 'a']).format({
        r: 10 / 255,
        g: 20 / 255,
        b: 30 / 255,
        a: 0.5,
      })).toEqual('rgba(10, 20, 30, 0.5)')
    })
  })
})
