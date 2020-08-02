import { ColorFormatter, RGBA } from './types'

export class ObjectColorFormat
  implements ColorFormatter<{ [key: string]: number }> {
  constructor(private components: string[], private normalized: boolean) {}
  public parse(v: { [key: string]: number }) {
    v = v || {}
    const result: RGBA = { r: 0, g: 0, b: 0, a: 1 }
    this.components.forEach((key, i) => {
      result[key] = (v[key] || 0) / (this.normalized ? 1 : 255)
    })
    return result
  }

  public format(rgba: RGBA) {
    const result: { [key: string]: number } = {}
    this.components.forEach((key, i) => {
      result[key] =
        (this.normalized ? rgba[key] : Math.round(rgba[key] * 255)) || 0
    })
    return result
  }
}
