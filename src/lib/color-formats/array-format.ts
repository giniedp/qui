import { ColorFormatter, RGBA } from './types'

export class ArrayColorFormat implements ColorFormatter<number[]> {
  constructor(private components: string[], private normalized: boolean) {

  }
  public parse(v: number[] = []) {
    const result: RGBA = { r: 0, g: 0, b: 0, a: 1 }
    this.components.forEach((key, i) => {
      result[key] = (v[i] || 0) / (this.normalized ? 1 : 255)
    })
    return result
  }

  public format(rgba: RGBA) {
    return this.components.map((key) => (this.normalized ? rgba[key] : Math.round(rgba[key] * 255)) || 0)
  }
}
