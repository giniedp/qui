import { NumberColorFormat } from './number-format'

describe('NumberColorFormat', () => {

  describe('parse', () => {
    it('rgb', () => {
      expect(new NumberColorFormat(['r', 'g', 'b']).parse(0x00102030)).toEqual({
        r: 0x30 / 255,
        g: 0x20 / 255,
        b: 0x10 / 255,
        a: 1,
      })
    })

    it('rgba', () => {
      expect(new NumberColorFormat(['r', 'g', 'b', 'a']).parse(0x40102030)).toEqual({
        r: 0x30 / 255,
        g: 0x20 / 255,
        b: 0x10 / 255,
        a: 0x40 / 255,
      })
    })
  })

  describe('format', () => {
    it('rgb', () => {
      expect(new NumberColorFormat(['r', 'g', 'b']).format({
        r: 0x10 / 255,
        g: 0x20 / 255,
        b: 0x30 / 255,
        a: 1,
      })).toEqual(0x00302010)
    })

    it('rgba', () => {
      expect(new NumberColorFormat(['r', 'g', 'b', 'a']).format({
        r: 0x10 / 255,
        g: 0x20 / 255,
        b: 0x30 / 255,
        a: 1,
      })).toEqual(0xFF302010)
    })
  })
})
