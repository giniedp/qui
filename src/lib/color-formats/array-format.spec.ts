import { ArrayColorFormat } from './array-format';

describe('ArrayColorFormat', () => {

  describe('parse normalized', () => {
    it('rgb', () => {
      expect(new ArrayColorFormat(['r', 'g', 'b'], true).parse([0.25, 0.5, 0.75])).toEqual({
        r: 0.25,
        g: 0.5,
        b: 0.75,
        a: 1,
      })
    })

    it('rgba', () => {
      expect(new ArrayColorFormat(['r', 'g', 'b', 'a'], true).parse([0.25, 0.5, 0.75, 0.8])).toEqual({
        r: 0.25,
        g: 0.5,
        b: 0.75,
        a: 0.8,
      })
    })
  })

  describe('parse non normalized', () => {
    it('rgb', () => {
      expect(new ArrayColorFormat(['r', 'g', 'b'], false).parse([10, 20, 30])).toEqual({
        r: 10 / 255,
        g: 20 / 255,
        b: 30 / 255,
        a: 1,
      })
    })

    it('rgba', () => {
      expect(new ArrayColorFormat(['r', 'g', 'b', 'a'], false).parse([10, 20, 30, 40])).toEqual({
        r: 10 / 255,
        g: 20 / 255,
        b: 30 / 255,
        a: 40 / 255,
      })
    })
  })

  describe('format normalized', () => {
    it('rgb', () => {
      expect(new ArrayColorFormat(['r', 'g', 'b'], true).format({
        r: 0.25,
        g: 0.5,
        b: 0.75,
        a: 1,
      })).toEqual([0.25, 0.5, 0.75])
    })

    it('rgba', () => {
      expect(new ArrayColorFormat(['r', 'g', 'b', 'a'], true).format({
        r: 0.25,
        g: 0.5,
        b: 0.75,
        a: 0.8,
      })).toEqual([0.25, 0.5, 0.75, 0.8])
    })
  })

  describe('format non normalized', () => {
    it('rgb', () => {
      expect(new ArrayColorFormat(['r', 'g', 'b'], false).format({
        r: 10 / 255,
        g: 20 / 255,
        b: 30 / 255,
        a: 1,
      })).toEqual([10, 20, 30])
    })

    it('rgba', () => {
      expect(new ArrayColorFormat(['r', 'g', 'b', 'a'], false).format({
        r: 10 / 255,
        g: 20 / 255,
        b: 30 / 255,
        a: 40 / 255,
      })).toEqual([10, 20, 30, 40])
    })
  })
})
