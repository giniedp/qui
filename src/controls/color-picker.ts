// tslint:disable:no-bitwise
import m from 'mithril'

import {
  call,
  clamp,
  ControlDef,
  formatColor,
  getValue,
  HSV,
  hsv2rgb,
  HSVA,
  padLeft,
  parseColor,
  registerComponent,
  renderControl,
  rgb2hsv,
  RGBA,
  setValue,
  use,
} from './utils'

/**
 * Describes a color picker control
 */
export interface ColorPickerDef<T = any> extends ControlDef {
  /**
   * The type name of the control
   */
  type: 'color-picker'
  /**
   * The target object where to get/set the value
   *
   * @remarks
   * Requires the `property` option to be set.
   */
  target?: T
  /**
   * The property name of `target` object
   *
   * @remarks
   * Requires the `target` option to be set.
   */
  property?: keyof T
  /**
   * The color value as a string.
   *
   * @remarks
   * The format is determined by the `format` property.
   *
   * It is allowed to omit the '#' character but the '#' will be added on change
   *
   * It is allowed to use single character form per component (#f00 instead of #ff0000)
   * but it will always be written back as #ff0000 on change
   */
  value?: number | string | number[]
  /**
   * The format of the string value. Defaults to 'rgb'
   *
   * @remarks
   * This must be a combination of the letters `r`, `g`, `b` and `a`.
   *
   * A prefix of `#` indicates the input/output is a hex string. e.g. #rgba
   *
   * A prefix of `0x` indicates the input is a number. e.g. 0xrgba
   *
   * A prefix of `[]` indicates the input is an array of numbers. e.g. `[]rgba`
   *
   * If a prefix is missing `#` is assumed
   */
  format?: string
  /**
   * Will be called frequently during unput
   */
  onInput?: (value: ColorPickerDef) => void
  /**
   * Will be called once after input change
   */
  onChange?: (value: ColorPickerDef) => void
}

interface Attrs {
  data: ColorPickerDef
}

registerComponent('color-picker', (node: m.Vnode<Attrs>) => {

  let hue = 0 // range [0,1]
  let sat = 0 // range [0,1]
  let val = 0 // range [0,1]
  let a = 0   // range [0,1]

  function getHSVA(s = sat, v = val): HSVA {
    return {
      h: hue * 360,
      s: s,
      v: v,
      a: a,
    }
  }

  function setHSV(hsv: HSV) {
    hue = hsv.h / 360
    sat = hsv.s
    val = hsv.v
  }

  function setHSVA(hsv: HSVA) {
    setHSV(hsv)
    a = hsv.a
  }

  function getRGBA(): RGBA {
    return {
      ...hsv2rgb(getHSVA()),
      a: a,
    }
  }

  function getHexRGB(s?: number, v?: number) {
    const col = hsv2rgb(getHSVA(s, v))
    return '#' + [col.r, col.g, col.b].map((it) => padLeft(it.toString(16), 2, '0') ).join('')
  }

  function getHexRGBA(s?: number, v?: number) {
    const col = hsv2rgb(getHSVA(s, v))
    return '#' + [col.r, col.g, col.b, Math.floor(a * 255)].map((it) => padLeft(it.toString(16), 2, '0') ).join('')
  }

  function getCssRGBA(alpha: number = a) {
    const col = hsv2rgb(getHSVA())
    return ['rgba(', col.r, ',', col.g, ',', col.b, ',', alpha, ')'].join('')
  }

  function parseInput(value: string | number | number[], format: string) {
    const rgba = parseColor(value, format)
    setHSVA({
      ...rgb2hsv(rgba),
      a: rgba.a,
    })
  }

  function formatOutput(format: string) {
    return formatColor(getRGBA(), format)
  }

  function triggerInput() {
    use(node.attrs.data, (data) => {
      setValue(data, formatOutput(data.format))
      call(data.onInput, data)
    })
  }

  function triggerChange() {
    use(node.attrs.data, (data) => {
      setValue(data, formatOutput(data.format))
      call(data.onChange, data)
    })
  }

  function hasAlpha() {
    return use(node.attrs.data, (data) => {
      return data.format && data.format.match(/a/i)
    })
  }

  //
  // manual input
  //

  function inputR(e: Event) {
    input(e, 'r')
  }

  function inputG(e: Event) {
    input(e, 'g')
  }

  function inputB(e: Event) {
    input(e, 'b')
  }

  function input(e: Event, field: keyof RGBA) {
    const color = getRGBA()
    color[field] = parseInt((e.target as HTMLInputElement).value, 10)
    setHSV(rgb2hsv(color))
    if (e.type === 'input') {
      triggerInput()
    }
    if (e.type === 'change') {
      triggerChange()
    }
  }

  function inputA(e: Event) {
    a = parseFloat((e.target as HTMLInputElement).value)
    if (e.type === 'input') {
      triggerInput()
    }
    if (e.type === 'change') {
      triggerChange()
    }
  }

  function inputHex(e: Event) {
    if (e.type === 'change') {
      parseInput((e.target as HTMLInputElement).value, hasAlpha() ? 'rgba' : 'rgb')
      triggerChange()
    }
  }

  //
  // drag input
  //

  let target: HTMLElement
  let kind: 'sv' | 'h' | 'a'
  function beginPickSV(e: MouseEvent) {
    target = e.target as HTMLElement
    kind = 'sv'
    onMouseMove(e)
  }

  function beginPickH(e: MouseEvent) {
    target = e.target as HTMLElement
    kind = 'h'
    onMouseMove(e)
  }

  function beginPickA(e: MouseEvent) {
    target = e.target as HTMLElement
    kind = 'a'
    onMouseMove(e)
  }

  function onMouseMove(e: MouseEvent | TouchEvent) {
    if (!target) {
      return
    }

    const rect = target.getBoundingClientRect()
    const tx = window.pageXOffset || document.documentElement.scrollLeft
    const ty = window.pageYOffset || document.documentElement.scrollTop

    const cw = target.clientWidth
    const ch = target.clientHeight
    let cx = 0
    let cy = 0
    if ('touches' in e) {
      cx = e.touches.item(0).pageX
      cy = e.touches.item(0).pageY
    } else {
      cx = e.pageX
      cy = e.pageY
    }
    cx = clamp((cx - tx - rect.left) / cw, 0, 1)
    cy = clamp((cy - ty - rect.top) / ch, 0, 1)

    if (kind === 'sv') {
      sat = cx
      val = 1 - cy
    }
    if (kind === 'h') {
      hue = (1 - cx)
    }
    if (kind === 'a') {
      a = cx
    }

    triggerInput()
    m.redraw()
  }

  function onMouseUp() {
    if (target != null) {
      target = null
      triggerChange()
    }
  }

  return {
    oncreate: () => {
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
      document.addEventListener('touchmove', onMouseMove)
      document.addEventListener('touchend', onMouseUp)
      document.addEventListener('touchcancel', onMouseUp)
    },
    onremove: () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('touchmove', onMouseMove)
      document.removeEventListener('touchend', onMouseUp)
      document.removeEventListener('touchcancel', onMouseUp)
    },
    oninit: () => {
      use(node.attrs.data, (data) => {
        parseInput(getValue(data), data.format)
      })
    },
    view: () => {
      return renderControl(node, (data) => {
        const rgba = getRGBA()
        return [
          m('.color-picker-inputs',
            m("input.input-hex[type='text']", { value: hasAlpha() ? getHexRGBA() : getHexRGB(), onchange: inputHex }),
            m("input.input-r[type='number']", { min: 0, max: 255, step: 1, value: rgba.r, onchange: inputR }),
            m("input.input-g[type='number']", { min: 0, max: 255, step: 1, value: rgba.g, onchange: inputG }),
            m("input.input-b[type='number']", { min: 0, max: 255, step: 1, value: rgba.b, onchange: inputB }),
          ),
          m('.color-picker-panel',
            m('.color-picker-sv', { tabindex: 0, onmousedown: beginPickSV, ontouchstart: beginPickSV,
              style: {
                'background-color': `${getHexRGB(1, 1)}`,
                'user-select': 'none',
              },
            },
              m('.color-picker-sv-bg', {
                style: {
                  background: 'linear-gradient(to right,rgba(255,255,255,1),rgba(255,255,255,0))',
                  'user-select': 'none',
                  'pointer-events': 'none',
                },
              }),
              m('.color-picker-sv-bg', {
                style: {
                  background: 'linear-gradient(to top,rgba(0,0,0,1),rgba(0,0,0,0))',
                  'user-select': 'none',
                  'pointer-events': 'none',
                },
              }),
              m('.color-picker-sv-cursor', {
                style: {
                  'user-select': 'none',
                  'pointer-events': 'none',
                  'background-color': `${getHexRGB()}`,
                  left: `${sat * 100}%`,
                  top: `${(1 - val) * 100}%`,
                },
              }),
            ),
            m('.color-picker-h', { tabindex: 0, onmousedown: beginPickH, ontouchstart: beginPickH,
              style: {
                'user-select': 'none',
                background: 'linear-gradient(to right, #f00 0, #f0f 17% , #00f 33% , #0ff 50% , #0f0 67% , #ff0 83% , #f00 100%)',
              },
            },
              m('.color-picker-h-cursor', {
                style: {
                  'user-select': 'none',
                  'pointer-events': 'none',
                  'background-color': `${getHexRGB(1, 1)}`,
                  position: 'absolute',
                  left: `${(1 - hue) * 100}%`,
                },
              }),
            ),
            !hasAlpha() ? null : m('.color-picker-a', { tabindex: 0, onmousedown: beginPickA, ontouchstart: beginPickA,
              style: {
                'user-select': 'none',
              },
            },
              m('.color-picker-a-bg', {
                style: {
                  background: `linear-gradient(to right, ${getCssRGBA(0)}, ${getCssRGBA(1)})`,
                },
              }),
              m('.color-picker-a-cursor', {
                style: {
                  'user-select': 'none',
                  'pointer-events': 'none',
                  position: 'absolute',
                  left: `${a * 100}%`,
                },
              }),
            ),
          ),

        ]
      })
    },
  }
})
