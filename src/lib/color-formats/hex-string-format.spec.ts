import { HexStringFormat } from './hex-string-format'

describe('HexStringFormat', () => {

  describe('parse', () => {
    it('rgb #102030', () => {
      expect(new HexStringFormat(['r', 'g', 'b']).parse('#102030')).toEqual({
        r: 0x10 / 255,
        g: 0x20 / 255,
        b: 0x30 / 255,
        a: 1,
      })
    })

    it('rgb #123', () => {
      expect(new HexStringFormat(['r', 'g', 'b']).parse('#123')).toEqual({
        r: 0x11 / 255,
        g: 0x22 / 255,
        b: 0x33 / 255,
        a: 1,
      })
    })

    it('rgba #10203040', () => {
      expect(new HexStringFormat(['r', 'g', 'b', 'a']).parse('#10203040')).toEqual({
        r: 0x10 / 255,
        g: 0x20 / 255,
        b: 0x30 / 255,
        a: 0x40 / 255,
      })
    })
  })

  describe('format', () => {
    it('rgb', () => {
      expect(new HexStringFormat(['r', 'g', 'b']).format({
        r: 0x10 / 255,
        g: 0x20 / 255,
        b: 0x30 / 255,
        a: 1,
      })).toEqual('#102030')
    })

    it('rgba', () => {
      expect(new HexStringFormat(['r', 'g', 'b', 'a']).format({
        r: 0x10 / 255,
        g: 0x20 / 255,
        b: 0x30 / 255,
        a: 0x40 / 255,
      })).toEqual('#10203040')
    })
  })
})
