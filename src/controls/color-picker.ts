// tslint:disable:no-bitwise
import m from 'mithril'

import { call, clamp, ControlDef, HSV, hsv2rgb, HSVA, label, padLeft, registerComponent, rgb2hsv, RGBA, use } from './utils'

/**
 * Describes a color picker control
 */
export interface ColorPickerDef extends ControlDef {
  /**
   * The type name of the control
   */
  type: 'color-picker'
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
  value?: string
  /**
   * The format of the string value. Defaults to 'rgb'
   *
   * @remarks
   * This must be a combination of the letters r, g, b and a
   * and it must match the input value.
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

  const defaultFormat = 'rgb'

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

  function getCssRGB() {
    const col = hsv2rgb(getHSVA())
    return ['rgb(', col.r, ',', col.g, ',', col.b, ')'].join('')
  }

  function parseInput(value: string, format: string = defaultFormat) {
    const reg = /[0-9a-f]+/i
    value = (value || '').toLowerCase()
    if (!reg.test(value)) {
      return
    }

    value = value.match(reg)[0]

    if (value.length === format.length) {
      value = value.split('').map((it) => [it, it].join('')).join('')
    }

    if (value.length !== format.length * 2) {
      return
    }

    const rgba: any = {
      r: 0,
      g: 0,
      b: 0,
      a: 1,
    }
    format.split('').forEach((key, i) => {
      rgba[key] = parseInt(value.substr(i * 2, 2), 16)
      if (key === 'a') {
        rgba[key] = rgba[key] / 255
      }
    })

    setHSVA({
      ...rgb2hsv(rgba),
      a: rgba.a,
    })
  }

  function formatOutput(format: string = defaultFormat) {
    const col = getRGBA()
    col.a = Math.floor(col.a * 255)
    return '#' + format.split('').map((key: any) => padLeft(col[key].toString(16), 2, '0')).join('')
  }

  function triggerInput() {
    use(node.attrs.data, (data) => {
      data.value = formatOutput(data.format)
      call(data.onInput, data)
    })
  }

  function triggerChange() {
    use(node.attrs.data, (data) => {
      data.value = formatOutput(data.format)
      call(data.onChange, data)
    })
  }

  //
  // manual input
  //

  function inputR(e: Event) {
    const color = getRGBA()
    color.r = parseInt((e.target as HTMLInputElement).value, 10)
    setHSV(rgb2hsv(color))
    if (e.type === 'input') {
      triggerInput()
    }
    if (e.type === 'change') {
      triggerChange()
    }
  }

  function inputG(e: Event) {
    const color = getRGBA()
    color.g = parseInt((e.target as HTMLInputElement).value, 10)
    setHSV(rgb2hsv(color))
    if (e.type === 'input') {
      triggerInput()
    }
    if (e.type === 'change') {
      triggerChange()
    }
  }

  function inputB(e: Event) {
    const color = getRGBA()
    color.b = parseInt((e.target as HTMLInputElement).value, 10)
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
      parseInput((e.target as HTMLInputElement).value, 'rgba')
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
        parseInput(data.value, data.format)
      })
    },
    view: () => {
      return use(node.attrs.data, (data) => {
        const rgba = getRGBA()
        return m('div', { class: 'qui-control qui-control-color-picker', key: data.key },
          label(data.label),
          m('section',
            m('div', { class: 'color-picker-inputs' },
              m('input', { type: 'text', class: 'input-hex', value: getHexRGBA(), onchange: inputHex }),
            ),
            m('div', { class: 'color-picker-inputs' },
              m('input', { type: 'number', class: 'input-r', min: 0, max: 255, step: 1, value: rgba.r, onchange: inputR }),
              m('input', { type: 'number', class: 'input-g', min: 0, max: 255, step: 1, value: rgba.g, onchange: inputG }),
              m('input', { type: 'number', class: 'input-b', min: 0, max: 255, step: 1, value: rgba.b, onchange: inputB }),
            ),
            m('div', { class: 'color-picker-panel' },
              m('div', { class: 'color-picker-sv', tabindex: 0, onmousedown: beginPickSV, ontouchstart: beginPickSV,
                style: {
                  'background-color': `${getHexRGB(1, 1)}`,
                  'user-select': 'none',
                },
              },
                m('div', { class: 'color-picker-sv-bg',
                  style: {
                    background: 'linear-gradient(to right,rgba(255,255,255,1),rgba(255,255,255,0))',
                    'user-select': 'none',
                    'pointer-events': 'none',
                  },
                }),
                m('div', { class: 'color-picker-sv-bg',
                  style: {
                    background: 'linear-gradient(to top,rgba(0,0,0,1),rgba(0,0,0,0))',
                    'user-select': 'none',
                    'pointer-events': 'none',
                  },
                }),
                m('div', { class: 'color-picker-sv-cursor',
                  style: {
                    'user-select': 'none',
                    'pointer-events': 'none',
                    'background-color': `${getHexRGB()}`,
                    left: `${sat * 100}%`,
                    top: `${(1 - val) * 100}%`,
                  },
                }),
              ),
              m('div', { class: 'color-picker-h', tabindex: 0, onmousedown: beginPickH, ontouchstart: beginPickH,
                style: {
                  'user-select': 'none',
                  background: 'linear-gradient(to right, #f00 0, #f0f 17% , #00f 33% , #0ff 50% , #0f0 67% , #ff0 83% , #f00 100%)',
                },
              },
                m('div', { class: 'color-picker-h-cursor',
                  style: {
                    'user-select': 'none',
                    'pointer-events': 'none',
                    'background-color': `${getHexRGB(1, 1)}`,
                    position: 'absolute',
                    left: `${(1 - hue) * 100}%`,
                  },
                }),
              ),
              m('div', { class: 'color-picker-a', tabindex: 0, onmousedown: beginPickA, ontouchstart: beginPickA,
                style: {
                  'user-select': 'none',
                },
              },
                m('div', { class: 'color-picker-a-bg',
                  style: {
                    background: `linear-gradient(to right, ${getCssRGBA(0)}, ${getCssRGBA(1)})`,
                  },
                }),
                m('div', { class: 'color-picker-a-cursor',
                  style: {
                    'user-select': 'none',
                    'pointer-events': 'none',
                    position: 'absolute',
                    left: `${a * 100}%`,
                  },
                }),
              ),
            ),

          ),
        )
      })
    },
  }
})
