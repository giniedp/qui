import { padLeft } from '../utils'
import { ColorFormatter, RGBA } from './types'

export class HexStringFormat implements ColorFormatter<string> {
  constructor(private components: string[]) {}
  public parse(value: string = '#000') {
    const result: RGBA = { r: 0, g: 0, b: 0, a: 1 }
    let v: string = value.match(/[0-9a-f]+/i)[0]
    if (v.length === this.components.length) {
      v = v
        .split('')
        .map((it) => `${it}${it}`)
        .join('')
    }
    this.components.forEach((key, i) => {
      result[key] = parseInt(v.substr(i * 2, 2), 16) / 255
    })
    return result
  }

  public format(rgba: RGBA) {
    return (
      '#' +
      this.components
        .map((key) => padLeft(Math.round(rgba[key] * 255).toString(16), 2, '0'))
        .join('')
    )
  }
}
