import { ColorFormatter, RGBA } from './types'

export class CssStringFormat implements ColorFormatter<string> {
  constructor(private components: string[]) {}
  public parse(value: string) {
    value = value || 'rgba(0, 0, 0)'
    const result: RGBA = { r: 0, g: 0, b: 0, a: 1 }
    const values = value
      .replace(/[rgba\(\)]/gi, '')
      .split(/,\s*?/gi)
      .map(Number)
    this.components.forEach((key, i) => {
      result[key] = (values[i] || 0) / (key === 'a' ? 1 : 255)
    })
    return result
  }

  public format(rgba: RGBA) {
    return (
      this.components.join('') +
      '(' +
      this.components
        .map((key) => {
          return key === 'a' ? rgba[key] : Math.round(rgba[key] * 255)
        })
        .join(', ') +
      ')'
    )
  }
}
