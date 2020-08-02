import m from 'mithril'

import {
  registerComponent,
  getModelValue,
} from './core'
import { call, clamp, use, twuiClass, viewFn } from './utils'
import { ComponentModel, ValueSource, ComponentAttrs } from './types'

/**
 * Pad component attributes
 * @public
 */
export type PadAttrs = ComponentAttrs<PadModel>

/**
 * Pad component model
 * @public
 */
export interface PadModel<T = any> extends ComponentModel, ValueSource<T, any> {
  /**
   * The type name of the control
   */
  type: 'pad'
  /**
   * The object field names. Defaults to `['x', 'y', 'z']`
   */
  keys?: string[]
  /**
   * X-Axis min and max valuse
   */
  xRange?: [number, number]
  /**
   * Y-Axis min and max valuse
   */
  yRange?: [number, number]
  /**
   * This is called when the control value has been changed.
   */
  onInput?: (model: PadModel<T>, value: number) => void
  /**
   * This is called once the control value is committed by the user.
   *
   * @remarks
   * Unlike the `onInput` callback, this is not necessarily called for each value change.
   */
  onChange?: (model: PadModel<T>, value: number) => void
}


registerComponent<PadAttrs>('pad', (node) => {
  let x = 0
  let y = 0
  let vx = 0
  let vy = 0
  let kx = 'x'
  let ky = 'y'

  function updateState() {
    const data = node.attrs.data
    const value: any = getModelValue(data) || {}
    {
      [kx, ky] = data.keys || [kx, ky]
    }
    vx = value[kx] || 0
    vy = value[ky] || 0
    const xRange = data.xRange || [0, 1]
    const yRange = data.yRange || [0, 1]
    x = vx / (xRange[1] - xRange[0])
    y = vy / (yRange[1] - yRange[0])
  }

  function toModelValue(): [number, number] {
    const data = node.attrs.data
    const xRange = data.xRange || [0, 1]
    const yRange = data.yRange || [0, 1]
    vx = xRange[0] + (xRange[1] - xRange[0]) * x
    vy = yRange[0] + (yRange[1] - yRange[0]) * y
    return [vx, vy]
  }

  function onChange(type: 'change' | 'input') {
    toModelValue()
    const data = node.attrs.data
    {
      [kx, ky] = data.keys || [kx, ky]
    }
    const value: any = getModelValue(data) || {}
    value[kx] = vx
    value[ky] = vy
    call(type === 'input' ? data.onInput : data.onChange, data, value)
  }

  let target: HTMLElement
  function onMouseDown(e: MouseEvent) {
    target = e.target as HTMLElement
    onMouseMove(e, true)
  }

  function onMouseMove(e: MouseEvent | TouchEvent, skipPrevent?: boolean) {
    if (!target) {
      return
    }
    if (!skipPrevent) {
      e.preventDefault()
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
    x = clamp((cx - tx - rect.left) / cw, 0, 1)
    y = clamp((cy - ty - rect.top) / ch, 0, 1)

    onChange('input')
    m.redraw()
  }

  function onMouseUp() {
    if (target != null) {
      target = null
      onChange('change')
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
      updateState()
    },
    view: viewFn((data) => m(
      'div',
      {
        class: twuiClass(data.type),
        tabindex: 0,
        onmousedown: onMouseDown,
        ontouchstart: onMouseDown,
      },
      m('.pad-x-axis', {
        style: {
          'pointer-events': 'none',
          position: 'absolute',
          left: 0,
          right: 0,
          top: `${y * 100}%`,
          height: `1px`,
        },
      }),
      m('.pad-y-axis', {
        style: {
          'pointer-events': 'none',
          position: 'absolute',
          left: `${x * 100}%`,
          top: 0,
          bottom: 0,
          width: `1px`,
        },
      }),
      m('.pad-cursor', {
        style: {
          'pointer-events': 'none',
          left: `${x * 100}%`,
          top: `${y * 100}%`,
          position: 'absolute',
          width: '11px',
          height: '11px',
          'margin-top': '-5px',
          'margin-left': '-5px',
          border: '1px solid white',
          'border-radius': '5px',
          'box-shadow': '0px 0px 2px 1px rgba(0, 0, 0, 0.75)',
        },
      }),
    )),
  }
})
