// tslint:disable:no-bitwise
import m from 'mithril'

import { call, clamp, ControlDef, hsv2rgb, HSVA, label, registerComponent, rgb2hsv, tap } from './utils'

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

  let hue = 0
  let sat = 0
  let val = 0
  let a = 0

  function getHSVA(s = sat, v = val) {
    return {
      h: hue,
      s: s,
      v: v,
      a: a,
    }
  }

  function setHSV(hsv: HSVA) {
    hue = hsv.h
    sat = hsv.s
    val = hsv.v
    a = hsv.a
  }

  function getRGBHex(s?: number, v?: number) {
    const col = hsv2rgb(getHSVA(s, v))
    return '#' + (16777216 | col.b | (col.g << 8) | (col.r << 16)).toString(16).slice(1)
  }

  function getRGBA(alpha: number) {
    const col = hsv2rgb(getHSVA())
    return `rgba(${col.r}, ${col.g}, ${col.b}, ${alpha})`
  }

  function parseInput(value: string, format: string) {
    const reg = /[0-9a-f]+/i
    value = (value || '').toLowerCase()
    if (!reg.test(value)) {
      return
    }

    value = value.match(reg)[0]

    if (value.length === format.length) {
      value = value.split('').map((it) => [it, it].join('')).join('')
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

    setHSV({
      ...rgb2hsv(rgba),
      a: rgba.a,
    })
  }

  function formatOutput(format: string) {
    const col: any = {
      ...hsv2rgb(getHSVA()),
      a: Math.floor(a * 255),
    }
    return '#' + format.split('').map((key, i) => {
      let v = ((col[key] || 0) & 255).toString(16)
      return v.length === 1 ? `0${v}` : v
    }).join('')
  }

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
      hue = (1 - cy) * 360
    }
    if (kind === 'a') {
      a = cx
    }

    tap(node.attrs.data, (data) => {
      data.value = formatOutput(data.format || 'rgb')
      call(data.onInput, data)
    })

    m.redraw()
  }

  function onMouseUp() {
    if (target != null) {
      target = null
      tap(node.attrs.data, (data) => {
        data.value = formatOutput(data.format || 'rgb')
        call(data.onChange, data)
      })
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
      tap(node.attrs.data, (data) => {
        parseInput(data.value, data.format || 'rgb')
      })
    },
    view: () => {
      return tap(node.attrs.data, (data) => {
        return m('div', { class: 'qui-control qui-control-color-picker', key: data.key },
          label(data.label),
          m('section', {
            //
          },
            m('div', { class: 'color-picker-sv', onmousedown: beginPickSV, ontouchstart: beginPickSV,
              style: {
                'background-color': `${getRGBHex(1, 1)}`,
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
                  left: `${sat * 100}%`,
                  top: `${(1 - val) * 100}%`,
                },
              }),
            ),
            m('div', { class: 'color-picker-h', onmousedown: beginPickH, ontouchstart: beginPickH,
              style: {
                'user-select': 'none',
                background: 'linear-gradient(#f00 0, #f0f 17% , #00f 33% , #0ff 50% , #0f0 67% , #ff0 83% , #f00 100%)',
              },
            },
              m('div', { class: 'color-picker-h-cursor',
                style: {
                  'user-select': 'none',
                  'pointer-events': 'none',
                  top: `${(1 - hue / 360) * 100}%`,
                },
              }),
            ),
            m('div', { class: 'color-picker-a', onmousedown: beginPickA, ontouchstart: beginPickA,
              style: {
                'user-select': 'none',
              },
            },
              m('div', { class: 'color-picker-a-bg',
                style: {
                  background: `linear-gradient(to right, ${getRGBA(0)}, ${getRGBHex()})`,
                },
              }),
              m('div', { class: 'color-picker-a-cursor',
                style: {
                  'user-select': 'none',
                  'pointer-events': 'none',
                  left: `${a * 100}%`,
                },
              }),
            ),
            m('div', { class: 'color-picker-out' },
              m('div', { class: 'color-picker-out-bg', style: { 'background-color': getRGBA(a)} },
              ),
            ),
          ),
        )
      })
    },
  }
})
