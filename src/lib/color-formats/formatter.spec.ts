import { getColorFormatter } from './'
import { ArrayColorFormat } from './array-format'
import { CssStringFormat } from './css-string-format'
import { HexStringFormat } from './hex-string-format'
import { NumberColorFormat } from './number-format'
import { ObjectColorFormat } from './object-format'

describe('getColorFormatter', () => {
  it('#rgb', () => {
    const a = getColorFormatter('#rgb')
    const b = getColorFormatter('#rgb')
    expect(a instanceof HexStringFormat).toBe(true)
    expect(a).toBe(b)
  })

  it('rgb()', () => {
    expect(getColorFormatter('rgb()') instanceof CssStringFormat).toBe(true)
  })

  it('0xrgb', () => {
    expect(getColorFormatter('0xrgb') instanceof NumberColorFormat).toBe(true)
  })

  it('{}rgb', () => {
    expect(getColorFormatter('{}rgb') instanceof ObjectColorFormat).toBe(true)
  })

  it('{n}rgb', () => {
    expect(getColorFormatter('{n}rgb') instanceof ObjectColorFormat).toBe(true)
  })

  it('[]rgb', () => {
    expect(getColorFormatter('[]rgb') instanceof ArrayColorFormat).toBe(true)
  })

  it('[n]rgb', () => {
    expect(getColorFormatter('[n]rgb') instanceof ArrayColorFormat).toBe(true)
  })
})
