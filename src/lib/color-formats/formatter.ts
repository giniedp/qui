import { ArrayColorFormat } from './array-format'
import { CssStringFormat } from './css-string-format'
import { HexStringFormat } from './hex-string-format'
import { NumberColorFormat } from './number-format'
import { ObjectColorFormat } from './object-format'
import { ColorFormatter } from './types'

const formatter: { [key: string]: ColorFormatter<any> } = {}

/**
 * Gets a formatter implementation for the given format
 *
 * @public
 * @param format - The format code
 */
export function getColorFormatter(format: string = 'rgb'): ColorFormatter<any> {
  if (format in formatter) {
    return formatter[format]
  }
  const components = (format.match(/[rgba]+/)[0] || '').split('')
  if (/(\[n?\])/.test(format)) {
    formatter[format] = new ArrayColorFormat(components, /\[n\]/.test(format))
  } else if (/(\{n?\})/.test(format)) {
    formatter[format] = new ObjectColorFormat(components, /\{n\}/.test(format))
  } else if (/0x/.test(format)) {
    formatter[format] = new NumberColorFormat(components)
  } else if (/(\(\))/.test(format)) {
    formatter[format] = new CssStringFormat(components)
  } else {
    formatter[format] = new HexStringFormat(components)
  }
  return formatter[format]
}
