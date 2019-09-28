// tslint:disable:no-bitwise
import { padLeft } from '../utils'
import { ColorFormatter, RGBA } from './types'

export class NumberColorFormat implements ColorFormatter<number> {
  private componentsRev: string[]
  constructor(private components: string[]) {
    this.componentsRev = components.slice().reverse()
  }
  public parse(v: number = 0) {
    const result: RGBA = { r: 0, g: 0, b: 0, a: 1 }
    this.components.forEach((key, i) => {
      result[key] = ((v >> (i * 8)) & 255) / 255
    })
    return result
  }

  public format(rgba: RGBA) {
    const val = this.componentsRev
      .map((key) =>
        padLeft(Math.round(rgba[key] * 255 || 0).toString(16), 2, '0'),
      )
      .join('')
    return parseInt('0x' + val, 16)
  }
}
